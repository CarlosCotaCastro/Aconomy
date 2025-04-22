<?php

use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// User private channel
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Group private channel
Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    // Check if user is a member of the group
    return Group::find($groupId)->users()
        ->where('user_id', $user->id)
        ->where('approved', true)
        ->exists();
});

// Notifications channel for users
Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
