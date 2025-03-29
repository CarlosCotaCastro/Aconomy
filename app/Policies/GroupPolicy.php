<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GroupPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Group $group): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Group $group): bool
    {
        $userInGroup = $group->users()->where('user_id', $user->id)->first();
        return $userInGroup && $userInGroup->pivot->approved;
    }

    public function delete(User $user, Group $group): bool
    {
        $userInGroup = $group->users()->where('user_id', $user->id)->first();
        return $userInGroup && $userInGroup->pivot->approved;
    }

    public function restore(User $user, Group $group): bool
    {
        $userInGroup = $group->users()->where('user_id', $user->id)->first();
        return $userInGroup && $userInGroup->pivot->approved;
    }

    public function forceDelete(User $user, Group $group): bool
    {
        $userInGroup = $group->users()->where('user_id', $user->id)->first();
        return $userInGroup && $userInGroup->pivot->approved;
    }

    public function join(User $user, Group $group): bool
    {
        return !$group->users()->where('user_id', $user->id)->exists();
    }

    public function approve(User $user, Group $group): bool
    {
        $userInGroup = $group->users()->where('user_id', $user->id)->first();
        return $userInGroup && $userInGroup->pivot->approved;
    }

    public function approveMembers(User $user, Group $group): bool
    {
        $userInGroup = $group->users()->where('user_id', $user->id)->first();
        return $userInGroup && $userInGroup->pivot->approved;
    }
} 