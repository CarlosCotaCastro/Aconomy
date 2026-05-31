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
import UserAvatar from '@/Components/UserAvatar.jsx';
import { lightTokens } from '@/lightTheme';

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
                <UserAvatar user={user} size={size} />
            </IconButton>
        </Tooltip>
    );

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(187, 134, 252, 0.2)'
                        : 'secondary.light',
                    mr: 2,
                    border: (theme) => theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : 'none',
                }}>
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
                                background: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.02)'
                                    : lightTokens.surface,
                                backdropFilter: 'blur(10px)',
                                border: (theme) => theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : `1px solid ${lightTokens.border}`,
                                borderRadius: (theme) => theme.palette.mode === 'dark' ? undefined : '28px',
                                boxShadow: (theme) => theme.palette.mode === 'dark' ? undefined : lightTokens.shadow,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    background: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : lightTokens.surfaceSolid,
                                    boxShadow: (theme) => theme.palette.mode === 'dark'
                                        ? '0 12px 40px rgba(187, 134, 252, 0.15)'
                                        : theme.shadows[4],
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    paddingTop: '56.25%', // 16:9 aspect ratio
                                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : lightTokens.bg,
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
                                            bgcolor: (theme) => theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.08)'
                                                : lightTokens.bg2,
                                        }}
                                    >
                                        <InventoryIcon sx={{ 
                                            fontSize: 48, 
                                            color: (theme) => theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.3)'
                                                : lightTokens.muted,
                                        }} />
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