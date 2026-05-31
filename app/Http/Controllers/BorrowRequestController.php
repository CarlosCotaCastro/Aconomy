<?php

namespace App\Http\Controllers;

use App\Models\BorrowRequest;
use App\Models\Item;
use App\Models\User;
use App\Notifications\BorrowRequestApprovedNotification;
use App\Notifications\BorrowRequestCounteredNotification;
use App\Notifications\BorrowRequestDeniedNotification;
use App\Notifications\BorrowRequestNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class BorrowRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Get borrow requests where the user is the borrower or lender
        $outgoingRequests = $user->borrowRequests()
            ->with(['item', 'lender'])
            ->latest()
            ->get();

        $incomingRequests = $user->lendRequests()
            ->with(['item', 'borrower'])
            ->latest()
            ->get();

        return Inertia::render('BorrowRequests/Index', [
            'outgoingRequests' => $outgoingRequests,
            'incomingRequests' => $incomingRequests,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $item = Item::findOrFail($request->query('item'));
        $user = Auth::user();

        // Check if the user is not the owner of the item
        if ($item->user_id === $user->id) {
            return redirect()->back()->with('error', 'You cannot borrow your own item.');
        }

        // Check if the item is available
        if (! $item->isAvailable()) {
            return redirect()->back()->with('error', 'This item is currently not available for borrowing.');
        }

        // Check if there's already a pending request for this item
        $pendingRequest = $item->pendingBorrowRequestForUser($user->id);
        if ($pendingRequest !== false) {
            return redirect(
                to: route('borrow-requests.show', ['borrow_request' => $pendingRequest])
            );
        }

        return Inertia::render('BorrowRequests/Create', [
            'item' => $item->load('user'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'message' => 'nullable|string|max:500',
            'requested_due_at' => 'required|date|after:today',
        ]);

        $user = Auth::user();
        $item = Item::findOrFail($validated['item_id']);

        // Check if the user is not the owner of the item
        if ($item->user_id === $user->id) {
            return redirect()->back()->with('error', 'You cannot borrow your own item.');
        }

        // Check if the item is available
        if (! $item->isAvailable()) {
            return redirect()->back()->with('error', 'This item is currently not available for borrowing.');
        }

        // Check if there's already a pending request for this item
        $pendingRequest = $item->pendingBorrowRequestForUser($user->id);
        if ($pendingRequest !== false) {
            return redirect(
                to: route('borrow-requests.show', ['borrowRequest' => $pendingRequest->first()])
            );
        }

        // Create the borrow request
        $borrowRequest = BorrowRequest::create([
            'item_id' => $item->id,
            'lender_id' => $item->user_id,
            'borrower_id' => $user->id,
            'message' => $validated['message'] ?? null,
            'requested_due_at' => $validated['requested_due_at'],
            'status' => 'pending',
            'expires_at' => now()->addDays(7), // Request expires in 7 days
        ]);

        Log::info('BorrowRequest created', [
            'borrow_request_id' => $borrowRequest->id,
            'item_id' => $borrowRequest->item_id,
            'lender_id' => $borrowRequest->lender_id,
            'borrower_id' => $borrowRequest->borrower_id,
        ]);

        // Notify the lender about the borrow request
        try {
            Log::info('Attempting to send notification to lender', [
                'lender_email' => $item->user->email,
                'lender_id' => $item->user->id,
            ]);

            $item->user->notify(new BorrowRequestNotification($borrowRequest));

            Log::info('BorrowRequestNotification sent successfully', [
                'lender_email' => $item->user->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send BorrowRequestNotification', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'lender_email' => $item->user->email,
            ]);
        }

        return redirect()->route('borrow-requests.index')->with('success', 'Borrow request sent successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BorrowRequest $borrowRequest)
    {
        // Authorize that the user is either the lender or borrower
        $this->authorize('view', $borrowRequest);

        // Load the relationships
        $borrowRequest->load(['item', 'lender', 'borrower']);

        // Generate QR code if the request is approved and the user is the lender
        $qrCode = null;
        if ($borrowRequest->isApproved() && $borrowRequest->lender_id === Auth::id()) {
            // Generate a new code (or use existing if it's still valid)
            if (! $borrowRequest->isHandoverCodeValid()) {
                $borrowRequest->generateHandoverCode();
            }

            // Generate QR code
            $qrData = json_encode([
                'type' => 'borrow_handover',
                'borrow_request_id' => $borrowRequest->id,
                'code' => $borrowRequest->handover_code,
            ]);

            $qrCode = base64_encode(QrCode::format('svg')->size(300)->generate($qrData));
        }

        return Inertia::render('BorrowRequests/Show', [
            'borrowRequest' => $borrowRequest,
            'qrCode' => $qrCode,
            'codeExpiresAt' => $borrowRequest->handover_code_expires_at?->diffForHumans(),
        ]);
    }

    /**
     * Approve a borrow request
     */
    public function approve(BorrowRequest $borrowRequest)
    {
        // Authorize that the user is the lender
        $this->authorize('respond', $borrowRequest);

        // Check if the request is still pending
        if (! $borrowRequest->isPending()) {
            return redirect()->back()->with('error', 'This request has already been processed.');
        }

        // Approve with the return date the borrower requested.
        $borrowRequest->update([
            'status' => 'approved',
            'agreed_due_at' => $borrowRequest->requested_due_at,
        ]);

        // Notify the borrower
        $borrowRequest->borrower->notify(new BorrowRequestApprovedNotification($borrowRequest));

        return redirect()->route('borrow-requests.show', $borrowRequest)->with('success', 'Borrow request approved successfully.');
    }

    /**
     * Propose a shorter return date than the borrower requested.
     */
    public function counter(Request $request, BorrowRequest $borrowRequest)
    {
        // Authorize that the user is the lender and the request is still pending
        $this->authorize('respond', $borrowRequest);

        $validated = $request->validate([
            'proposed_due_at' => [
                'required',
                'date',
                'after:today',
                'before_or_equal:'.optional($borrowRequest->requested_due_at)->toDateString(),
            ],
        ]);

        $borrowRequest->update([
            'status' => 'countered',
            'proposed_due_at' => $validated['proposed_due_at'],
        ]);

        // Notify the borrower that a shorter period has been proposed
        $borrowRequest->borrower->notify(new BorrowRequestCounteredNotification($borrowRequest));

        return redirect()->route('borrow-requests.show', $borrowRequest)
            ->with('success', 'You proposed a shorter borrowing period. The borrower needs to agree.');
    }

    /**
     * Borrower accepts the lender's proposed (shorter) return date.
     */
    public function acceptCounter(BorrowRequest $borrowRequest)
    {
        $this->authorize('respondToCounter', $borrowRequest);

        $borrowRequest->update([
            'status' => 'approved',
            'agreed_due_at' => $borrowRequest->proposed_due_at,
        ]);

        // Notify the lender that the borrower agreed to the shorter period
        $borrowRequest->lender->notify(new BorrowRequestApprovedNotification($borrowRequest));

        return redirect()->route('borrow-requests.show', $borrowRequest)
            ->with('success', 'You accepted the proposed return date.');
    }

    /**
     * Borrower declines the lender's proposed (shorter) return date.
     */
    public function declineCounter(BorrowRequest $borrowRequest)
    {
        $this->authorize('respondToCounter', $borrowRequest);

        $borrowRequest->update([
            'status' => 'denied',
        ]);

        $borrowRequest->lender->notify(new BorrowRequestDeniedNotification($borrowRequest, null));

        return redirect()->route('borrow-requests.index')
            ->with('success', 'You declined the proposed return date.');
    }

    /**
     * Deny a borrow request
     */
    public function deny(Request $request, BorrowRequest $borrowRequest)
    {
        // Authorize that the user is the lender
        $this->authorize('respond', $borrowRequest);

        // Validate the reason
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        // Check if the request is still pending
        if (! $borrowRequest->isPending()) {
            return redirect()->back()->with('error', 'This request has already been processed.');
        }

        // Update the request status
        $borrowRequest->update([
            'status' => 'denied',
        ]);

        // Notify the borrower
        $borrowRequest->borrower->notify(new BorrowRequestDeniedNotification($borrowRequest, $validated['reason'] ?? null));

        return redirect()->route('borrow-requests.index')->with('success', 'Borrow request denied.');
    }

    /**
     * Verify handover code and complete the borrow request
     */
    public function verifyHandoverCode(Request $request, BorrowRequest $borrowRequest)
    {
        // Authorize that the user is the borrower
        $this->authorize('verifyHandover', $borrowRequest);

        // Validate the code
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        // Check if the request is approved
        if (! $borrowRequest->isApproved()) {
            return redirect()->back()->with('error', 'This request has not been approved yet.');
        }

        // Check if the code is valid
        if (! $borrowRequest->isHandoverCodeValid() || $borrowRequest->handover_code !== strtoupper($validated['code'])) {
            return redirect()->back()->with('error', 'Invalid or expired handover code.');
        }

        // Create a lending record, carrying over the agreed return date.
        $lending = \App\Models\Lending::create([
            'item_id' => $borrowRequest->item_id,
            'lender_id' => $borrowRequest->lender_id,
            'borrower_id' => $borrowRequest->borrower_id,
            'lent_at' => now(),
            'due_at' => $borrowRequest->agreed_due_at,
        ]);

        // Update the request status
        $borrowRequest->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return redirect()->route('lendings.show', $lending)->with('success', 'Item has been successfully borrowed!');
    }
}
