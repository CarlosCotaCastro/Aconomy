<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use App\Notifications\GroupJoinRequestNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupUserController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Group $group)
    {
        $user = Auth::user();

        if ($group->users()->where('user_id', $user->id)->exists()) {
            return redirect()->route('groups.index')
                ->with('error', 'You are already a member of this group.');
        }

        $group->users()->attach($user->id, ['approved' => false]);

        \Log::info('User requested to join group', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'group_id' => $group->id,
            'group_name' => $group->name
        ]);

        $approvedMembers = $group->users()
            ->wherePivot('approved', true)
            ->get();

        \Log::info('Sending notifications to ' . $approvedMembers->count() . ' approved members', [
            'members_count' => $approvedMembers->count(),
            'member_ids' => $approvedMembers->pluck('id')->toArray(),
            'member_emails' => $approvedMembers->pluck('email')->toArray()
        ]);

        foreach ($approvedMembers as $member) {
            try {
                \Log::info('Sending notification to: ' . $member->email);
                $notification = new GroupJoinRequestNotification($group, $user);
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

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(Group $group)
    {
        $user = Auth::user();

        if (!$group->users()->where('user_id', $user->id)->exists()) {
            return redirect()->route('groups.index')
                ->with('error', 'You are not a member of this group.');
        }

        $group->users()->detach($user->id);

        return redirect()->route('groups.index')
            ->with('success', 'You have left the group successfully.');
    }
}
