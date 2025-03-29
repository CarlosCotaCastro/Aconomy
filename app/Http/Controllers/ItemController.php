<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = auth()->user()->items;
        return Inertia::render('Items/Index', ['items' => $items]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Items/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $item = auth()->user()->items()->create($validated);

        return redirect()->route('items.index')->with('message', 'Item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        $this->authorize('view', $item);
        return Inertia::render('Items/Show', ['item' => $item->load('lendings.lender', 'lendings.borrower')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        $this->authorize('update', $item);
        return Inertia::render('Items/Edit', ['item' => $item]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        $this->authorize('update', $item);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $item->update($validated);

        return redirect()->route('items.index')->with('message', 'Item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $this->authorize('delete', $item);
        $item->delete();

        return redirect()->route('items.index')->with('message', 'Item deleted successfully.');
    }

    public function groupItems(Group $group)
    {
        $items = $group->items()
            ->with('user')
            ->get()
            ->map(function ($item) {
                $item->is_available = $item->isAvailable();
                return $item;
            });

        return Inertia::render('Items/GroupItems', [
            'group' => $group,
            'items' => $items,
        ]);
    }
}
