import {
    Box,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Chip,
    Avatar,
    Button,
    useTheme,
    useMediaQuery,
    Tooltip,
    IconButton,
    Stack,
} from '@mui/material';
import { Link, useForm } from '@inertiajs/react';
import { 
    Inventory as InventoryIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

export default function RecentItemsGrid({ items, currentUserId }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const { post: returnItem, processing } = useForm();

    const handleReturnItem = (lendingId) => {
        returnItem(route('lendings.return', lendingId), {
            onError: (errors) => {
                if (errors.status === 419) {
                    window.location.reload();
                }
            },
        });
    };

    const renderUserAvatar = (user, size = 32) => (
        <Tooltip title={user.name}>
            <IconButton
                component={Link}
                href={route('profile.show', user.id)}
                size="small"
                sx={{ p: 0 }}
            >
                <Avatar
                    src={user.profile_image_path ? `/storage/${user.profile_image_path}` : undefined}
                    alt={user.name}
                    sx={{
                        width: size,
                        height: size,
                        bgcolor: !user.profile_image_path ? stringToColor(user.name) : undefined,
                        fontSize: `${size * 0.4}px`
                    }}
                >
                    {!user.profile_image_path && user.name.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
        </Tooltip>
    );

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                    <InventoryIcon />
                </Avatar>
                <Typography variant="h6">
                    {t('groups.recentItems')}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid 
                        key={item.id} 
                        size={{ 
                            xs: 12,    // 1 item per row on mobile
                            sm: 6,     // 2 items per row on tablet
                            md: 4,     // 3 items per row on desktop
                            lg: 3      // 4 items per row on large screens
                        }}
                    >
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4],
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    paddingTop: '56.25%', // 16:9 aspect ratio
                                    bgcolor: 'grey.100',
                                    overflow: 'hidden'
                                }}
                            >
                                {item.image_path ? (
                                    <Box
                                        component="img"
                                        src={`/storage/${item.image_path}`}
                                        alt={item.name}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'grey.200'
                                        }}
                                    >
                                        <InventoryIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                                    </Box>
                                )}
                            </Box>

                            <CardContent sx={{ 
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                '&:last-child': {
                                    pb: 2
                                }
                            }}>
                                <Typography variant="h6" component="h3" gutterBottom noWrap>
                                    {item.name}
                                </Typography>

                                {item.description && (
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{
                                            mb: 2,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            flexGrow: 1
                                        }}
                                    >
                                        {item.description}
                                    </Typography>
                                )}

                                <Box sx={{ mb: 2 }}>
                                    <Stack 
                                        direction="row" 
                                        spacing={1} 
                                        alignItems="center"
                                        sx={{ mb: 1 }}
                                    >
                                        {renderUserAvatar(item.user)}
                                        <Typography variant="body2" color="text.secondary">
                                            {item.user.id === currentUserId ? t('common.me') : item.user.name}
                                        </Typography>
                                    </Stack>

                                    {!item.is_available && item.current_borrower && (
                                        <Stack 
                                            direction="row" 
                                            spacing={1} 
                                            alignItems="center"
                                        >
                                            {renderUserAvatar(item.user, 24)}
                                            <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            {renderUserAvatar(item.current_borrower, 24)}
                                        </Stack>
                                    )}
                                </Box>

                                <Box sx={{ mt: 'auto' }}>
                                    <Chip
                                        label={item.is_available ? t('items.available') : t('items.currentlyBorrowed')}
                                        color={item.is_available ? "success" : "error"}
                                        size="small"
                                    />
                                </Box>
                            </CardContent>

                            <CardActions sx={{ pt: 0 }}>
                                {item.is_available && item.user_id !== currentUserId && (
                                    <Button
                                        component={Link}
                                        href={route('borrow-requests.create', { item: item.id })}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        fullWidth
                                    >
                                        {t('items.requestToBorrow')}
                                    </Button>
                                )}
                                {!item.is_available && item.current_borrower?.id === currentUserId && (
                                    <Button
                                        onClick={() => handleReturnItem(item.active_lending?.id)}
                                        disabled={!item.active_lending?.id || processing}
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        fullWidth
                                    >
                                        {t('items.returnItem')}
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
} 