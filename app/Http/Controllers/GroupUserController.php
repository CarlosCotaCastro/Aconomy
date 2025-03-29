<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use App\Notifications\GroupJoinRequestNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage (join a group).
     */
    public function store(Group $group)
    {
        $user = Auth::user();
        
        // Check if user is already in the group
        if ($group->users()->where('user_id', $user->id)->exists()) {
            return redirect()->route('groups.index')
                ->with('error', 'You are already a member of this group.');
        }
        
        // Add user to the group (pending approval)
        $group->users()->attach($user->id, ['approved' => false]);
        
        // Log the group join request
        \Log::info('User requested to join group', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'group_id' => $group->id,
            'group_name' => $group->name
        ]);
        
        // Get all approved members of the group to notify them
        $approvedMembers = $group->users()
            ->wherePivot('approved', true)
            ->get();
        
        // Log for debugging
        \Log::info('Sending notifications to ' . $approvedMembers->count() . ' approved members', [
            'members_count' => $approvedMembers->count(),
            'member_ids' => $approvedMembers->pluck('id')->toArray(),
            'member_emails' => $approvedMembers->pluck('email')->toArray()
        ]);
        
        // Send notification to all approved members
        foreach ($approvedMembers as $member) {
            try {
                \Log::info('Sending notification to: ' . $member->email);
                $notification = new \App\Notifications\GroupJoinRequestNotification($group, $user);
                $member->notify($notification);
                \Log::info('Notification sent successfully to: ' . $member->email);
            } catch (\Exception $e) {
                \Log::error('Failed to send notification to: ' . $member->email, [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
        
        return redirect()->route('groups.index')
            ->with('success', 'Your request to join the group has been sent. You will be notified when approved.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage (leave a group).
     */
    public function destroy(Group $group)
    {
        $user = Auth::user();
        
        // Check if user is in the group
        if (!$group->users()->where('user_id', $user->id)->exists()) {
            return redirect()->route('groups.index')
                ->with('error', 'You are not a member of this group.');
        }
        
        // Remove user from the group
        $group->users()->detach($user->id);
        
        return redirect()->route('groups.index')
            ->with('success', 'You have left the group successfully.');
    }
}
