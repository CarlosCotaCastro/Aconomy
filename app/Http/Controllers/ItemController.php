<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $item = new Item([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'user_id' => auth()->id(),
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('items', 'public');
            $item->image_path = $path;
        }

        $item->save();

        return redirect()->route('items.index')->with('message', 'Item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        $this->authorize('view', $item);
        
        // Add availability info
        $item->load('lendings.lender', 'lendings.borrower', 'user');
        $item->isAvailable = $item->isAvailable();
        
        return Inertia::render('Items/Show', [
            'item' => $item,
        ]);
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $item->name = $validated['name'];
        $item->description = $validated['description'];

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($item->image_path) {
                Storage::disk('public')->delete($item->image_path);
            }
            
            $path = $request->file('image')->store('items', 'public');
            $item->image_path = $path;
        }

        $item->save();

        return redirect()->route('items.index')->with('message', 'Item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $this->authorize('delete', $item);
        
        // Delete image if it exists
        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }
        
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
