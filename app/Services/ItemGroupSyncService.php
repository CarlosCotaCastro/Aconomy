<?php

namespace App\Services;

use App\Models\Group;
use App\Models\Item;
use App\Models\User;

class ItemGroupSyncService
{
    /**
     * Align every item owned by the user with their currently approved groups.
     */
    public function syncUserItemsToApprovedGroups(User $user): void
    {
        $approvedGroupIds = $user->approvedGroups()->pluck('groups.id')->all();

        $user->items()->each(function (Item $item) use ($approvedGroupIds) {
            $item->groups()->sync($approvedGroupIds);
            $item->searchable();
        });
    }

    /**
     * Attach all of the user's items to a single group without removing other group links.
     */
    public function attachUserItemsToGroup(User $user, Group $group): void
    {
        $user->items()->each(function (Item $item) use ($group) {
            $item->groups()->syncWithoutDetaching([$group->id]);
            $item->searchable();
        });
    }

    /**
     * Remove a group from all of the user's items.
     */
    public function detachUserItemsFromGroup(User $user, Group $group): void
    {
        $user->items()->each(function (Item $item) use ($group) {
            $item->groups()->detach($group->id);
            $item->searchable();
        });
    }

    /**
     * Attach a newly created item to all of the owner's approved groups and index it.
     */
    public function attachNewItemToApprovedGroups(Item $item, User $user): void
    {
        $approvedGroupIds = $user->approvedGroups()->pluck('groups.id')->all();

        $item->groups()->attach($approvedGroupIds);
        $item->searchable();
    }
}
