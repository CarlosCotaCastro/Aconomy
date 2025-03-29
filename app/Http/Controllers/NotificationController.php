<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get unread notifications
        $unreadNotifications = $user->unreadNotifications;
        
        // Get read notifications (limit to 20 most recent)
        $readNotifications = $user->readNotifications()->latest()->take(20)->get();
        
        return Inertia::render('Notifications/Index', [
            'unreadNotifications' => $unreadNotifications,
            'readNotifications' => $readNotifications,
        ]);
    }
    
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
     * Mark a notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->findOrFail($id);
        $notification->markAsRead();
        
        return redirect()->back();
    }
    
    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();
        
        return redirect()->back();
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
            ->map(function($notification) {
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