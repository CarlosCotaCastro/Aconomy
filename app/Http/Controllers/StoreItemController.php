<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Services\ItemGroupSyncService;
use Illuminate\Http\Request;

class StoreItemController extends Controller
{
    public function __construct(private ItemGroupSyncService $itemGroupSync) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:8096',
        ]);

        $user = $request->user();

        $item = Item::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'user_id' => $user->id,
        ]);

        $this->itemGroupSync->attachNewItemToApprovedGroups($item, $user);

        return redirect()->route('items.index')->with('message', 'Item created successfully.');
    }
}
