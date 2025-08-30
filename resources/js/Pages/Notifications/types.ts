import { PageProps, PaginatedData, Timestamps } from '@/types/common';

// Notification Types
export interface Notification extends Timestamps {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: NotificationData;
    read_at?: string;
}

export interface NotificationData {
    title: string;
    message: string;
    action_url?: string;
    action_text?: string;
    icon?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    // Specific notification data
    item_id?: number;
    item_name?: string;
    group_id?: number;
    group_name?: string;
    user_id?: number;
    user_name?: string;
    borrow_request_id?: number;
    return_request_id?: number;
    lending_id?: number;
}

export type NotificationType = 
    | 'App\\Notifications\\BorrowRequestNotification'
    | 'App\\Notifications\\BorrowRequestApprovedNotification'
    | 'App\\Notifications\\BorrowRequestDeniedNotification'
    | 'App\\Notifications\\ReturnRequestNotification'
    | 'App\\Notifications\\ReturnRequestApprovedNotification'
    | 'App\\Notifications\\ReturnRequestRejectedNotification'
    | 'App\\Notifications\\GroupJoinRequestNotification'
    | 'App\\Notifications\\GroupJoinRequestApprovedNotification';

// Notification page props
export interface NotificationIndexPageProps extends PageProps {
    notifications: PaginatedData<Notification>;
    unreadCount: number;
    filters?: NotificationFilters;
}

// Notification filters
export interface NotificationFilters {
    type?: NotificationType;
    read?: boolean;
    date_from?: string;
    date_to?: string;
}

// Notification actions
export interface NotificationActions {
    markAsRead: (notificationId: string) => void;
    markAsUnread: (notificationId: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (notificationId: string) => void;
}

// Notification component props
export interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead?: (notificationId: string) => void;
    onMarkAsUnread?: (notificationId: string) => void;
    onDelete?: (notificationId: string) => void;
}


