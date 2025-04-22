<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $groups = Group::with('users')->latest()->paginate(2);

        return Inertia::render('Groups/Index', ['groups' => $groups]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Groups/Create');
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

        $group = Group::create($validated);
        $group->users()->attach(auth()->id(), ['approved' => true]);

        return redirect()->route('groups.index')->with('message', 'Group created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        $group->load(['users' => function ($query) {
            $query->select('users.id', 'users.name', 'users.email', 'group_user.approved');
        }]);

        return Inertia::render('Groups/Show', [
            'group' => $group,
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
        return Inertia::render('Groups/Edit', ['group' => $group->load('users')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->route('groups.index')->with('message', 'Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
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

        // Send notification to the approved user
        $user->notify(new \App\Notifications\GroupJoinRequestApprovedNotification($group, auth()->user()));

        return redirect()->back()->with('success', 'User approved successfully.');
    }
}
