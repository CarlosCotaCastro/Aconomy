<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Global search across items, groups and people that are visible to the
     * authenticated user (scoped to their approved groups for privacy).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = trim((string) $request->input('q', ''));

        $approvedGroupIds = $user->groups()
            ->wherePivot('approved', true)
            ->pluck('groups.id');

        return response()->json([
            'query' => $query,
            'items' => $this->searchItems($user, $approvedGroupIds, $query),
            'groups' => $this->searchGroups($user, $query),
            'people' => $this->searchPeople($user, $approvedGroupIds, $query),
        ]);
    }

    /**
     * Items in the user's approved groups, excluding their own.
     *
     * @param  \Illuminate\Support\Collection<int, int>  $approvedGroupIds
     * @return array<int, array<string, mixed>>
     */
    private function searchItems(User $user, $approvedGroupIds, string $query): array
    {
        if ($approvedGroupIds->isEmpty()) {
            return [];
        }

        // Use Scout for relevance matching on the name, then constrain group
        // membership and ownership against the real relations so the behaviour
        // is identical across search engines.
        $candidateIds = Item::search($query)->take(50)->keys();

        if ($candidateIds->isEmpty()) {
            return [];
        }

        $items = Item::with('user')
            ->whereIn('items.id', $candidateIds->all())
            ->where('user_id', '!=', $user->id)
            ->whereHas('groups', function ($q) use ($approvedGroupIds) {
                $q->whereIn('groups.id', $approvedGroupIds->all());
            })
            ->take(12)
            ->get();

        return $items->map(fn (Item $item) => [
            'id' => $item->id,
            'name' => $item->name,
            'available' => $item->isAvailable(),
            'image' => $item->image_path ? '/storage/'.$item->image_path : null,
            'owner' => [
                'id' => $item->user->id,
                'name' => $item->user->name,
                'profile_image_path' => $item->user->profile_image_path,
            ],
        ])->values()->all();
    }

    /**
     * Groups the user belongs to or can discover, matched by name/description.
     *
     * @return array<int, array<string, mixed>>
     */
    private function searchGroups(User $user, string $query): array
    {
        $builder = Group::query()->with(['users:id']);

        if ($query !== '') {
            $builder->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            });
        }

        return $builder->take(8)->get()->map(function (Group $group) use ($user) {
            $isMember = $group->users->contains('id', $user->id);

            return [
                'id' => $group->id,
                'name' => $group->name,
                'description' => $group->description,
                'avatar_image_path' => $group->avatar_image_path,
                'members_count' => $group->users->count(),
                'is_member' => $isMember,
            ];
        })->values()->all();
    }

    /**
     * People who share at least one approved group with the user.
     *
     * @param  \Illuminate\Support\Collection<int, int>  $approvedGroupIds
     * @return array<int, array<string, mixed>>
     */
    private function searchPeople(User $user, $approvedGroupIds, string $query): array
    {
        if ($approvedGroupIds->isEmpty()) {
            return [];
        }

        $builder = User::query()
            ->where('users.id', '!=', $user->id)
            ->whereHas('groups', function ($q) use ($approvedGroupIds) {
                $q->whereIn('groups.id', $approvedGroupIds->toArray())
                    ->where('group_user.approved', true);
            });

        if ($query !== '') {
            $builder->where('name', 'like', "%{$query}%");
        }

        return $builder->distinct()
            ->take(8)
            ->get(['id', 'name', 'profile_image_path'])
            ->map(fn (User $person) => [
                'id' => $person->id,
                'name' => $person->name,
                'profile_image_path' => $person->profile_image_path,
            ])->values()->all();
    }
}
