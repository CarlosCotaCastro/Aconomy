<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use App\Services\ItemGroupSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function __construct(private ItemGroupSyncService $itemGroupSync) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Group::with('users');
        $search = $request->get('search');
        $filter = $request->get('filter', 'all');
        $user = Auth::user();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply group type filter
        switch ($filter) {
            case 'my_groups':
                $query->whereHas('users', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
                break;
            case 'discover':
                $query->whereDoesntHave('users', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
                break;
            case 'all':
            default:
                // No additional filtering needed
                break;
        }

        $groups = $query->latest()->paginate(10);

        return Inertia::render('Groups/Index', [
            'groups' => $groups,
            'filters' => [
                'search' => $search,
                'filter' => $filter,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Groups/Create', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'avatar_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $groupData = [
            'name' => $validated['name'],
            'description' => $validated['description'],
        ];

        // Handle banner image upload
        if ($request->hasFile('banner_image')) {
            $bannerPath = $request->file('banner_image')->store('group-banners', 'public');
            $groupData['banner_image_path'] = $bannerPath;
        }

        // Handle avatar image upload
        if ($request->hasFile('avatar_image')) {
            $avatarPath = $request->file('avatar_image')->store('group-avatars', 'public');
            $groupData['avatar_image_path'] = $avatarPath;
        }

        $group = Group::create($groupData);
        $creator = Auth::user();
        $group->users()->attach($creator->id, ['approved' => true]);

        $this->itemGroupSync->attachUserItemsToGroup($creator, $group);

        return redirect()->route('groups.index')->with('message', 'Group created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        $userSelect = ['users.id', 'users.name', 'users.email', 'users.profile_image_path', 'group_user.approved', 'group_user.created_at'];

        $isApprovedMember = $group->users()
            ->where('users.id', Auth::id())
            ->wherePivot('approved', true)
            ->exists();

        $approvedMembersCount = $group->users()->wherePivot('approved', true)->count();

        if ($isApprovedMember) {
            $group->load(['users' => function ($query) use ($userSelect) {
                $query->select($userSelect);
            }]);
        } else {
            $currentMembership = $group->users()
                ->where('users.id', Auth::id())
                ->select($userSelect)
                ->first();

            $group->setRelation('users', $currentMembership ? collect([$currentMembership]) : collect([]));
        }

        // Get the 12 most recent items in the group
        $recentItemsQuery = $group->items()->latest()->take(12);

        if ($isApprovedMember) {
            $recentItems = $recentItemsQuery
                ->with(['user' => function ($query) {
                    $query->select('id', 'name', 'profile_image_path');
                }])
                ->get()
                ->map(function ($item) {
                    $item->is_available = $item->isAvailable();

                    return $item;
                });
        } else {
            $recentItems = $recentItemsQuery
                ->get(['id', 'name', 'description', 'image_path', 'user_id', 'created_at', 'updated_at'])
                ->map(function ($item) {
                    $item->is_available = $item->isAvailable();

                    return $item;
                });
        }

        // Determine if the current user is the group creator (first approved member)
        $groupCreator = $group->users()
            ->wherePivot('approved', true)
            ->orderBy('group_user.created_at', 'asc')
            ->first();

        $isGroupCreator = $groupCreator && $groupCreator->id === Auth::user()->id;

        return Inertia::render('Groups/Show', [
            'group' => $group,
            'recentItems' => $recentItems,
            'isGroupCreator' => $isGroupCreator,
            'canViewMembers' => $isApprovedMember,
            'approvedMembersCount' => $approvedMembersCount,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        // Check if the authenticated user is the group creator
        $groupCreator = $group->users()
            ->wherePivot('approved', true)
            ->orderBy('group_user.created_at', 'asc')
            ->first();

        if (! $groupCreator || $groupCreator->id !== Auth::user()->id) {
            abort(403, 'You can only edit groups you created.');
        }

        return Inertia::render('Groups/Edit', [
            'group' => $group->load('users'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group)
    {
        // Check if the authenticated user is the group creator
        $groupCreator = $group->users()
            ->wherePivot('approved', true)
            ->orderBy('group_user.created_at', 'asc')
            ->first();

        if (! $groupCreator || $groupCreator->id !== Auth::user()->id) {
            abort(403, 'You can only edit groups you created.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'avatar_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $groupData = [
            'name' => $validated['name'],
            'description' => $validated['description'],
        ];

        // Handle banner image upload
        if ($request->hasFile('banner_image')) {
            // Delete old banner if it exists
            if ($group->banner_image_path) {
                Storage::disk('public')->delete($group->banner_image_path);
            }
            $bannerPath = $request->file('banner_image')->store('group-banners', 'public');
            $groupData['banner_image_path'] = $bannerPath;
        }

        // Handle avatar image upload
        if ($request->hasFile('avatar_image')) {
            // Delete old avatar if it exists
            if ($group->avatar_image_path) {
                Storage::disk('public')->delete($group->avatar_image_path);
            }
            $avatarPath = $request->file('avatar_image')->store('group-avatars', 'public');
            $groupData['avatar_image_path'] = $avatarPath;
        }

        $group->update($groupData);

        return redirect()->route('groups.show', $group)->with('message', 'Group updated successfully.');
    }

    /**
     * Update group images.
     */
    public function updateImages(Request $request, Group $group)
    {
        // Check if the authenticated user is the group creator
        $groupCreator = $group->users()
            ->wherePivot('approved', true)
            ->orderBy('group_user.created_at', 'asc')
            ->first();

        if (! $groupCreator || $groupCreator->id !== Auth::user()->id) {
            abort(403, 'You can only edit groups you created.');
        }

        $request->validate([
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'avatar_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'delete_banner' => 'nullable|boolean',
            'delete_avatar' => 'nullable|boolean',
        ]);

        $groupData = [];

        // Handle banner image upload
        if ($request->hasFile('banner_image')) {
            // Delete old banner if it exists
            if ($group->banner_image_path) {
                Storage::disk('public')->delete($group->banner_image_path);
            }
            $bannerPath = $request->file('banner_image')->store('group-banners', 'public');
            $groupData['banner_image_path'] = $bannerPath;
        }

        // Handle avatar image upload
        if ($request->hasFile('avatar_image')) {
            // Delete old avatar if it exists
            if ($group->avatar_image_path) {
                Storage::disk('public')->delete($group->avatar_image_path);
            }
            $avatarPath = $request->file('avatar_image')->store('group-avatars', 'public');
            $groupData['avatar_image_path'] = $avatarPath;
        }

        // Handle banner deletion
        if ($request->boolean('delete_banner') && $group->banner_image_path) {
            Storage::disk('public')->delete($group->banner_image_path);
            $groupData['banner_image_path'] = null;
        }

        // Handle avatar deletion
        if ($request->boolean('delete_avatar') && $group->avatar_image_path) {
            Storage::disk('public')->delete($group->avatar_image_path);
            $groupData['avatar_image_path'] = null;
        }

        $group->update($groupData);

        return redirect()->back()->with('message', 'Group images updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        // Delete images if they exist
        if ($group->banner_image_path) {
            Storage::disk('public')->delete($group->banner_image_path);
        }
        if ($group->avatar_image_path) {
            Storage::disk('public')->delete($group->avatar_image_path);
        }

        $group->delete();

        return redirect()->route('groups.index')->with('message', 'Group deleted successfully.');
    }

    /**
     * Approve a user's request to join the group.
     */
    public function approve(Group $group, User $user)
    {
        // Check if the authenticated user is an approved member of the group
        $this->authorize('approveMembers', $group);

        $group->users()->updateExistingPivot($user->id, ['approved' => true]);

        $this->itemGroupSync->attachUserItemsToGroup($user, $group);

        // Send notification to the approved user
        $user->notify(new \App\Notifications\GroupJoinRequestApprovedNotification($group, Auth::user()));

        return redirect()->back()->with('success', 'User approved successfully.');
    }
}
