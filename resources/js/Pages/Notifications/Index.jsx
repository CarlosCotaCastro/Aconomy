import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Chip,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    Inventory as InventoryIcon,
    SwapHoriz as SwapHorizIcon,
    MarkEmailRead as MarkEmailReadIcon,
    DoneAll as DoneAllIcon,
    RequestQuote as RequestQuoteIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Helper function to get avatar icon based on notification type
const getNotificationIcon = (type) => {
    switch (type) {
        case 'borrow_request':
            return <RequestQuoteIcon color="primary" />;
        case 'group_join_request':
            return <GroupIcon sx={{ color: '#ff9800' }} />;
        case 'return_request':
            return <SwapHorizIcon sx={{ color: '#4caf50' }} />;
        default:
            return <NotificationsIcon color="primary" />;
    }
};

// Helper function to format notification title and message
const formatNotification = (notification) => {
    const data = notification.data;
    
    switch (data.type) {
        case 'borrow_request':
            return {
                title: 'Borrow Request',
                message: `${data.borrower_name} wants to borrow your ${data.item_name}`,
                url: data.url,
            };
        case 'group_join_request':
            return {
                title: 'Group Join Request',
                message: `${data.requester_name} wants to join your group: ${data.group_name}`,
                url: data.url,
            };
        case 'return_request':
            return {
                title: 'Return Request',
                message: `${data.borrower_name} wants to return your ${data.item_name}`,
                url: data.url,
            };
        default:
            return {
                title: data.title || 'Notification',
                message: data.body || 'You have a new notification',
                url: data.url || '#',
            };
    }
};

export default function Index({ auth, unreadNotifications, readNotifications }) {
    const { post: markAsRead } = useForm();
    const { post: markAllAsRead } = useForm();
    
    const handleMarkAsRead = (id) => {
        markAsRead(route('notifications.read', id));
    };
    
    const handleMarkAllAsRead = () => {
        markAllAsRead(route('notifications.read-all'));
    };
    
    const renderNotificationItem = (notification, isRead = false) => {
        const { title, message, url } = formatNotification(notification);
        const notificationDate = new Date(notification.created_at);
        
        return (
            <ListItem
                key={notification.id}
                alignItems="flex-start"
                secondaryAction={
                    !isRead && (
                        <Tooltip title="Mark as read">
                            <IconButton 
                                edge="end"
                                onClick={() => handleMarkAsRead(notification.id)}
                                size="small"
                            >
                                <MarkEmailReadIcon />
                            </IconButton>
                        </Tooltip>
                    )
                }
                sx={{ 
                    bgcolor: isRead ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                    borderRadius: 1,
                    mb: 1,
                }}
            >
                <ListItemAvatar>
                    <Avatar>
                        {getNotificationIcon(notification.data.type)}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" component={Link} href={url} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                {title}
                            </Typography>
                            {!isRead && (
                                <Chip 
                                    label="New" 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined" 
                                    sx={{ ml: 1, height: 20 }}
                                />
                            )}
                        </Box>
                    }
                    secondary={
                        <>
                            <Typography variant="body2" color="text.primary" sx={{ display: 'block' }}>
                                {message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {notificationDate.toLocaleString()}
                            </Typography>
                        </>
                    }
                />
            </ListItem>
        );
    };
    
    return (
        <AuthenticatedLayout>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Notifications</Typography>
                    {unreadNotifications.length > 0 && (
                        <Button 
                            variant="outlined" 
                            startIcon={<DoneAllIcon />}
                            onClick={handleMarkAllAsRead}
                        >
                            Mark All as Read
                        </Button>
                    )}
                </Box>
                
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Unread Notifications
                        </Typography>
                        
                        {unreadNotifications.length > 0 ? (
                            <List>
                                {unreadNotifications.map(notification => renderNotificationItem(notification))}
                            </List>
                        ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                You have no unread notifications.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Read Notifications
                        </Typography>
                        
                        {readNotifications.length > 0 ? (
                            <List>
                                {readNotifications.map(notification => renderNotificationItem(notification, true))}
                            </List>
                        ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                You have no read notifications.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
} 