<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Lending;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LendingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        $lendings = Lending::with(['item', 'lender', 'borrower'])
            ->where('lender_id', $user->id)
            ->orWhere('borrower_id', $user->id)
            ->latest()
            ->get();
        
        // Add active return request to each lending
        foreach ($lendings as $lending) {
            $lending->active_return_request = $lending->activeReturnRequest();
        }
            
        return Inertia::render('Lendings/Index', [
            'lendings' => $lendings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        
        $items = Item::where('user_id', $user->id)
            ->whereDoesntHave('lendings', function($query) {
                $query->whereNull('returned_at');
            })
            ->get();
            
        $potentialBorrowers = User::where('id', '!=', $user->id)
            ->whereHas('groups', function($query) use ($user) {
                $query->whereHas('users', function($subQuery) use ($user) {
                    $subQuery->where('users.id', $user->id);
                });
            })
            ->get();
            
        return Inertia::render('Lendings/Create', [
            'items' => $items,
            'potentialBorrowers' => $potentialBorrowers,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'borrower_id' => 'required|exists:users,id',
        ]);
        
        $user = Auth::user();
        
        // Check if the user owns the item
        $item = Item::findOrFail($validated['item_id']);
        if ($item->user_id !== $user->id) {
            return redirect()->back()->with('error', 'You can only lend items that you own.');
        }
        
        // Check if the item is already being lent
        if ($item->lendings()->whereNull('returned_at')->exists()) {
            return redirect()->back()->with('error', 'This item is already being lent.');
        }
        
        // Create the lending
        $lending = new Lending([
            'item_id' => $validated['item_id'],
            'lender_id' => $user->id,
            'borrower_id' => $validated['borrower_id'],
            'lent_at' => now(),
        ]);
        
        $lending->save();
        
        return redirect()->route('lendings.index')->with('success', 'Item has been lent successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lending $lending)
    {
        $this->authorize('view', $lending);
        
        $lending->load(['item', 'lender', 'borrower']);
        
        // Load the active return request, if any
        $lending->active_return_request = $lending->activeReturnRequest();
        
        return Inertia::render('Lendings/Show', [
            'lending' => $lending
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lending $lending)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lending $lending)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lending $lending)
    {
        //
    }
    
    /**
     * Mark the lending as returned.
     */
    public function return(Lending $lending)
    {
        $this->authorize('return', $lending);
        
        $lending->update([
            'returned_at' => now(),
        ]);
        
        return redirect()->back()->with('success', 'Item has been marked as returned.');
    }
    
    /**
     * Show form for requesting to borrow an item
     */
    public function requestBorrow(Item $item)
    {
        $user = Auth::user();
        
        // Check if the item is available
        if (!$item->isAvailable()) {
            return redirect()->back()->with('error', 'This item is currently not available for borrowing.');
        }
        
        // Check if the user is in the same group as the item owner
        $isInSameGroup = $user->groups()
            ->whereHas('users', function($query) use ($item) {
                $query->where('users.id', $item->user_id);
            })
            ->exists();
            
        if (!$isInSameGroup) {
            return redirect()->back()->with('error', 'You can only borrow items from users in your groups.');
        }
        
        return Inertia::render('Lendings/RequestBorrow', [
            'item' => $item->load('user'),
        ]);
    }
    
    /**
     * Store a borrowing request
     */
    public function storeBorrowRequest(Item $item, Request $request)
    {
        $user = Auth::user();
        
        // Check if the item is available
        if (!$item->isAvailable()) {
            return redirect()->back()->with('error', 'This item is currently not available for borrowing.');
        }
        
        // Validate the request
        $validated = $request->validate([
            'message' => 'nullable|string|max:255',
        ]);
        
        // Create the lending
        $lending = new Lending([
            'item_id' => $item->id,
            'lender_id' => $item->user_id,
            'borrower_id' => $user->id,
            'lent_at' => now(),
        ]);
        
        $lending->save();
        
        return redirect()->route('lendings.index')->with('success', 'Item has been requested successfully.');
    }
} 