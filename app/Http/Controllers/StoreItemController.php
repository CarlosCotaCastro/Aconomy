<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class StoreItemController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $approvedGroups = auth()->user()->approvedGroups;

        $item = Item::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'user_id' => auth()->id(),
        ]);

        $item->groups()->attach($approvedGroups->pluck('id')->toArray());
        $item->searchable();

        return redirect()->route('items.index')->with('message', 'Item created successfully.');
    }
}
