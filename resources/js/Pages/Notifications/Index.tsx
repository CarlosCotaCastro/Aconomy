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
    useTheme,
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
import { lightTokens } from '@/lightTheme';

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
    const theme = useTheme();
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
                    bgcolor: isRead ? 'transparent' : (theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.02)' 
                        : 'rgba(255, 138, 76, 0.06)'),
                    borderRadius: theme.palette.mode === 'dark' ? 1 : '18px',
                    mb: 1,
                    border: isRead ? 'none' : (theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : `1px solid ${lightTokens.border}`),
                    backdropFilter: !isRead && theme.palette.mode === 'dark' ? 'blur(10px)' : (!isRead ? 'blur(10px)' : 'none'),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(255, 138, 76, 0.1)',
                        transform: 'translateY(-1px)',
                    }
                }}
            >
                <ListItemAvatar>
                    <Avatar sx={{
                        bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : theme.palette.primary.light,
                        border: theme.palette.mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.2)' 
                            : 'none',
                    }}>
                        {getNotificationIcon(notification.data.type)}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                                variant="subtitle1" 
                                component={Link} 
                                href={url} 
                                sx={{ 
                                    textDecoration: 'none', 
                                    color: 'text.primary',
                                    fontWeight: !isRead ? 600 : 400,
                                    '&:hover': {
                                        color: 'primary.main',
                                    }
                                }}
                            >
                                {title}
                            </Typography>
                            {!isRead && (
                                <Chip 
                                    label="New" 
                                    size="small" 
                                    color="primary" 
                                    variant={theme.palette.mode === 'dark' ? 'filled' : 'outlined'}
                                    sx={{ 
                                        ml: 1, 
                                        height: 20,
                                        fontSize: '0.75rem',
                                        ...(theme.palette.mode === 'dark' && {
                                            bgcolor: 'rgba(25, 118, 210, 0.8)',
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                        })
                                    }}
                                />
                            )}
                        </Box>
                    }
                    secondary={
                        <>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    display: 'block',
                                    color: 'text.primary',
                                    opacity: isRead ? 0.7 : 1,
                                    fontWeight: !isRead ? 500 : 400,
                                }}
                            >
                                {message}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{
                                    color: 'text.secondary',
                                    opacity: theme.palette.mode === 'dark' ? 0.8 : 0.7,
                                }}
                            >
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
                
                <Card sx={{ 
                    mb: 4,
                    ...(theme.palette.mode === 'dark' ? {
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    } : {
                        bgcolor: lightTokens.surface,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${lightTokens.border}`,
                        boxShadow: lightTokens.shadow,
                        borderRadius: '28px',
                    })
                }}>
                    <CardContent>
                        <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{
                                color: 'text.primary',
                                fontWeight: 600,
                            }}
                        >
                            Unread Notifications
                        </Typography>
                        
                        {unreadNotifications.length > 0 ? (
                            <List>
                                {unreadNotifications.map(notification => renderNotificationItem(notification))}
                            </List>
                        ) : (
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    py: 2,
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    opacity: 0.7,
                                }}
                            >
                                You have no unread notifications.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
                
                <Card sx={{
                    ...(theme.palette.mode === 'dark' ? {
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    } : {
                        bgcolor: lightTokens.surface,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${lightTokens.border}`,
                        boxShadow: lightTokens.shadow,
                        borderRadius: '28px',
                    })
                }}>
                    <CardContent>
                        <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{
                                color: 'text.primary',
                                fontWeight: 600,
                            }}
                        >
                            Read Notifications
                        </Typography>
                        
                        {readNotifications.length > 0 ? (
                            <List>
                                {readNotifications.map(notification => renderNotificationItem(notification, true))}
                            </List>
                        ) : (
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    py: 2,
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    opacity: 0.7,
                                }}
                            >
                                You have no read notifications.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
} 