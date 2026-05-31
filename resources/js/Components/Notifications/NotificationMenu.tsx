import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Avatar,
    Divider,
    MenuList,
    Tooltip,
    Button,
    ButtonGroup,
    Chip,
    useTheme,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    DoneAll as DoneAllIcon,
    Group as GroupIcon,
    SwapHoriz as SwapHorizIcon,
    RequestQuote as RequestQuoteIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Comment as CommentIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { lightTokens } from '@/lightTheme';

// Helper function to get icon for notification types
const getNotificationIcon = (type) => {
    switch (type) {
        case 'borrow_request':
            return <RequestQuoteIcon color="primary" />;
        case 'group_join_request':
            return <GroupIcon sx={{ color: '#ff9800' }} />;
        case 'return_request':
            return <SwapHorizIcon sx={{ color: '#4caf50' }} />;
        case 'new_message':
            return <CommentIcon sx={{ color: '#5b6cff' }} />;
        case 'borrow_request_countered':
            return <RequestQuoteIcon sx={{ color: '#ff8a4c' }} />;
        default:
            return <NotificationsIcon color="primary" />;
    }
};

// Helper function to format notification content
const formatNotification = (notification) => {
    const data = notification.data;

    switch (data.type) {
        case 'borrow_request':
            return {
                title: 'Borrow Request',
                message: `${data.borrower_name} wants to borrow ${data.item_name}`,
                url: data.url,
                initiatorName: data.borrower_name,
                initiatorId: data.borrower_id,
                entityName: data.item_name,
                entityId: data.item_id,
                hasMessage: !!data.message,
                messageText: data.message,
                actions: {
                    approve: `/borrow-requests/${data.borrow_request_id}/approve`,
                    deny: `/borrow-requests/${data.borrow_request_id}/deny`
                }
            };
        case 'group_join_request':
            return {
                title: 'Group Join Request',
                message: `${data.requester_name} wants to join ${data.group_name}`,
                url: data.url,
                initiatorName: data.requester_name,
                initiatorId: data.requester_id,
                entityName: data.group_name,
                entityId: data.group_id,
                hasMessage: false,
                actions: {
                    approve: `/groups/${data.group_id}/users/${data.requester_id}/approve`
                }
            };
        case 'return_request':
            return {
                title: 'Return Request',
                message: `${data.borrower_name} wants to return ${data.item_name}`,
                url: data.url,
                initiatorName: data.borrower_name,
                initiatorId: data.borrower_id,
                entityName: data.item_name,
                entityId: data.item_id,
                hasMessage: !!data.notes,
                messageText: data.notes,
                actions: {
                    approve: `/return-requests/${data.return_request_id}/respond?action=approve`,
                    deny: `/return-requests/${data.return_request_id}/respond?action=reject`
                }
            };
        default:
            return {
                title: data.title || 'Notification',
                message: data.body || 'You have a new notification',
                url: data.url || '#',
                initiatorName: '',
                initiatorId: null,
                entityName: '',
                entityId: null,
                hasMessage: false,
                actions: {}
            };
    }
};

export default function NotificationMenu() {
    const { auth } = usePage().props;
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data);

            // Count unread notifications
            const unreadCount = response.data.filter(notification => !notification.read_at).length;
            setCount(unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch initial notifications
    useEffect(() => {
        fetchNotifications();

        // Listen for new notifications
        const channel = window.Echo?.private(`App.Models.User.${auth.user.id}`);
        if (channel) {
            channel.listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', () => {
                console.log('Received real-time notification!');
                fetchNotifications();
            });
        }

        // Set up polling every 30 seconds as a fallback
        const interval = setInterval(fetchNotifications, 30000);

        return () => {
            clearInterval(interval);
            // Remove event listener
            if (channel) {
                channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
            }
        };
    }, [auth.user.id]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications(); // Refresh when opening
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, {
            onSuccess: () => {
                setCount(0);
                setNotifications(notifications.map(notification => ({
                    ...notification,
                    read_at: new Date().toISOString()
                })));
                handleClose();
            }
        });
    };

    const handleAction = (url, method, notificationId) => {
        router.post(url, {}, {
            onSuccess: () => {
                // Mark notification as read
                if (notificationId) {
                    router.post(route('notifications.read', notificationId));
                }

                // Refresh notifications
                fetchNotifications();
                handleClose();
            }
        });
    };

    // Get initials for user avatar
    const getInitials = (name) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleClick}
                >
                    <Badge badgeContent={count} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 2,
                        sx: {
                            width: 380,
                            maxWidth: '100%',
                            mt: 1.5,
                            borderRadius: isDark ? 2 : '28px',
                            maxHeight: 'calc(100vh - 100px)',
                            overflow: 'auto',
                            ...(isDark ? {} : {
                                bgcolor: lightTokens.surface,
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${lightTokens.border}`,
                                boxShadow: lightTokens.shadow,
                            }),
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuList>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Notifications</Typography>
                        {count > 0 && (
                            <Tooltip title="Mark all as read">
                                <IconButton size="small" onClick={handleMarkAllAsRead}>
                                    <DoneAllIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    <Divider />

                    {notifications.length > 0 && (
                        notifications.slice(0, 5).map((notification) => {
                                const formatted = formatNotification(notification);
                                const isRead = notification.read_at !== null;
                                const canApprove = !!formatted.actions.approve;
                                const canDeny = !!formatted.actions.deny;

                                return (
                                    <Box key={notification.id} sx={{
                                        p: 2,
                                        borderBottom: isDark
                                            ? '1px solid rgba(0,0,0,0.08)'
                                            : `1px solid ${lightTokens.border}`,
                                        bgcolor: isRead
                                            ? 'transparent'
                                            : (isDark
                                                ? 'rgba(25, 118, 210, 0.04)'
                                                : 'rgba(255, 138, 76, 0.06)'),
                                    }}>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                            <Avatar sx={{
                                                bgcolor: isRead
                                                    ? (isDark ? 'grey.300' : 'rgba(20,20,20,0.08)')
                                                    : 'primary.main',
                                            }}>
                                                {formatted.initiatorName
                                                    ? getInitials(formatted.initiatorName)
                                                    : getNotificationIcon(notification.data.type)}
                                            </Avatar>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ fontWeight: isRead ? 'normal' : 'bold' }}
                                                >
                                                    {formatted.title}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary">
                                                    {formatted.message}
                                                </Typography>

                                                {formatted.hasMessage && (
                                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                        <CommentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} />
                                                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                            {
                                                                formatted.messageText?.length > 40
                                                                    ? formatted.messageText.substring(0, 40) + '...'
                                                                    : formatted.messageText
                                                            }
                                                        </Typography>
                                                    </Box>
                                                )}

                                                <Box sx={{ mt: 0.5 }}>
                                                    <Chip
                                                        icon={<PersonIcon fontSize="small" />}
                                                        label={formatted.initiatorName}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem', height: 22 }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                            <Button
                                                component={Link}
                                                href={formatted.url}
                                                size="small"
                                                onClick={handleClose}
                                                variant="text"
                                            >
                                                View Details
                                            </Button>

                                            {!isRead && (canApprove || canDeny) && (
                                                <ButtonGroup size="small" variant="outlined">
                                                    {canApprove && (
                                                        <Button
                                                            startIcon={<CheckIcon />}
                                                            color="success"
                                                            onClick={() => handleAction(formatted.actions.approve, 'post', notification.id)}
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {canDeny && (
                                                        <Button
                                                            startIcon={<CloseIcon />}
                                                            color="error"
                                                            onClick={() => handleAction(formatted.actions.deny, 'post', notification.id)}
                                                        >
                                                            Deny
                                                        </Button>
                                                    )}
                                                </ButtonGroup>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })
                        )
                    }
                    <Divider />
                    {notifications.length > 0 ? (
                        <MenuItem sx={{ mt: 2 }}
                            href={route('notifications.index')}
                            onClick={handleClose}
                            component={Link}>
                                View All Notifications
                        </MenuItem>

                    ) : (
                        <MenuItem sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No new notifications</Typography>
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </>
    );
} 