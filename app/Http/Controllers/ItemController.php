<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Item;
use App\Models\User;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:16048',
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

    public function groupSearch(Request $request)
    {
        $user = $request->user();

        // Get group IDs where user is approved
        $groupIds = $user->groups()->wherePivot('approved', true)->pluck('groups.id');
        if ($groupIds->isEmpty()) {
            return response()->json(['items' => []]);
        }

        // Use Scout/Meilisearch for searching items, filtering by allowed user_ids and group_ids
        $searchQuery = $request->filled('q') ? $request->q : '';

        $items = Item::search($searchQuery)->whereNotIn('user', $user->id)
            ->whereIn('groups', $groupIds->toArray())
            ->get();

        // Eager load user and groups for the filtered items
        $itemModels = Item::with(['user'])->whereIn('id', $items->pluck('id'))->get();

        $mappedItems = $itemModels->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'status' => $item->status ?? 'available',
                'image' => $item->image_path ? '/storage/'.$item->image_path : null,
                'owner' => [
                    'id' => $item->user->id,
                    'name' => $item->user->name,
                    'avatar' => $item->user->profile_image_path ? '/storage/'.$item->user->profile_image_path : null,
                ],
            ];
        });

        return response()->json(['items' => $mappedItems]);
    }
}
