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
            'lendings' => $lendings,
        ]);
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
            'lending' => $lending,
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
        if (! $item->isAvailable()) {
            return redirect()->back()->with('error', 'This item is currently not available for borrowing.');
        }

        // Check if the user is in the same group as the item owner
        $isInSameGroup = $user->groups()
            ->whereHas('users', function ($query) use ($item) {
                $query->where('users.id', $item->user_id);
            })
            ->exists();

        if (! $isInSameGroup) {
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
        if (! $item->isAvailable()) {
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
