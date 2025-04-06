<?php

namespace App\Http\Controllers;

use App\Models\Lending;
use App\Models\ReturnRequest;
use App\Notifications\ReturnRequestApprovedNotification;
use App\Notifications\ReturnRequestNotification;
use App\Notifications\ReturnRequestRejectedNotification;
use Illuminate\Http\Request;

class ReturnRequestController extends Controller
{
    /**
     * Create a new return request for a lending
     */
    public function store(Request $request, Lending $lending)
    {
        // Authorization check
        $this->authorize('createReturnRequest', $lending);

        // Check if there's already an active return request
        if ($lending->hasActiveReturnRequest()) {
            return redirect()->back()->with('error', 'There is already an active return request for this item.');
        }

        // Create a new return request
        $returnRequest = new ReturnRequest([
            'lending_id' => $lending->id,
            'status' => 'pending',
            'requested_at' => now(),
            'notes' => $request->notes,
        ]);

        $returnRequest->save();

        // Send notification to the lender
        $lending->lender->notify(new ReturnRequestNotification($returnRequest));

        return redirect()->back()->with('success', 'Return request has been sent to the lender.');
    }

    /**
     * Respond to a return request (approve or reject)
     */
    public function respond(Request $request, ReturnRequest $returnRequest)
    {
        // Authorization check
        $this->authorize('respond', $returnRequest);

        $action = $request->query('action');
        $reason = $request->input('reason');

        if ($action === 'approve') {
            // Mark the request as approved
            $returnRequest->update([
                'status' => 'approved',
                'responded_at' => now(),
            ]);

            // Update the lending as returned
            $returnRequest->lending->update([
                'returned_at' => now(),
            ]);

            // Send notification to the borrower
            $returnRequest->lending->borrower->notify(new ReturnRequestApprovedNotification($returnRequest));

            return redirect()->route('lendings.index')->with('success', 'Return request approved. The item has been marked as returned.');
        } elseif ($action === 'reject') {
            // Mark the request as rejected
            $returnRequest->update([
                'status' => 'rejected',
                'responded_at' => now(),
                'rejection_reason' => $reason,
            ]);

            // Send notification to the borrower
            $returnRequest->lending->borrower->notify(new ReturnRequestRejectedNotification($returnRequest, $reason));

            return redirect()->route('lendings.index')->with('success', 'Return request has been rejected.');
        }

        return redirect()->back()->with('error', 'Invalid action.');
    }
}
