<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GroupSearchItems extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Group $group)
    {
        $searchQuery = $request->input('query', '');

        $approvedUserIds = DB::table('group_user')->select('user_id')->where('approved', true)->get();

        // Check if the user is an approved member of the group
        $isUserApproved = $approvedUserIds->firstOrFail(fn ($item) => $item->user_id === Auth::id()) !== null;

        if (! $isUserApproved) {
            Log::warning('Unauthorized search attempt', [
                'user_id' => Auth::id(),
                'group_id' => $group->id,
            ]);

            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check database state before search
        $dbItemCount = $group->items()->count();
        Log::info('Database items', [
            'group_id' => $group->id,
            'item_count' => $dbItemCount,
        ]);

        try {
            // Search for items in the group using Meilisearch
            if ($searchQuery) {

                $groupId = $group->id;
                $items = Item::search($searchQuery)
                    ->whereIn('groups', $groupId)
                    ->get()
                ;

                Log::info('Search results with query', [
                    'query' => $searchQuery,
                    'filter' => 'group_id = '.$group->id,
                    'result_count' => $items->count(),
                ]);
            } else {
                // If no search query, return all items in the group from database
                $items = \App\Models\Item::with('groups')
                    ->where('group_id', $group->id)
                    ->paginate();

                Log::info('All items (no query)', [
                    'result_count' => $items->count(),
                ]);
            }

            // Load necessary relationships
            $items->load('user');

            // Add availability status to each item
            $items->each(function ($item) {
                $item->is_available = $item->isAvailable();
            });

            return response()->json($items);
        } catch (\Exception $e) {

            Log::error('Failed to search items', [
                'exception' => $e,
            ]);

            return response()->json([]);
        }
    }
}
