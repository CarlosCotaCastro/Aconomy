<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationApiController extends Controller
{
    /**
     * Get unread notifications count
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        $count = $user->unreadNotifications()->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Get latest notifications for the current user (API endpoint)
     */
    public function getLatestNotifications()
    {
        $user = Auth::user();

        // Get both unread and read notifications (limited to 10 most recent)
        $notifications = $user->notifications()
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($notification) {
                // Add the formatted type for frontend display
                $notification->formattedType = $this->getNotificationType($notification);

                return $notification;
            });

        return response()->json($notifications);
    }

    /**
     * Get readable notification type from class name
     */
    private function getNotificationType($notification)
    {
        $type = class_basename($notification->type);

        switch ($type) {
            case 'BorrowRequestNotification':
                return 'borrow_request';
            case 'GroupJoinRequestNotification':
                return 'group_join_request';
            case 'ReturnRequestNotification':
                return 'return_request';
            default:
                return 'notification';
        }
    }
}
