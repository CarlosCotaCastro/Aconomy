import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Avatar,
    Typography,
    Grid,
    Divider,
    Chip,
    Button,
    useTheme,
} from '@mui/material';
import UserAvatar from '@/Components/UserAvatar.jsx';
import GlassPaper from '@/Components/GlassPaper';
import {
    Person as PersonIcon,
    Inventory as InventoryIcon,
    History as HistoryIcon,
    ChatBubbleOutline as MessageIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RecentItemsGrid from '@/Pages/Groups/Partials/RecentItemsGrid';

export default function Show({ profileUser, items, borrowedItems, auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isCurrentUser = auth.user.id === profileUser.id;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('profile.userProfile', { name: profileUser.name })} />

            <Box sx={{ mb: 4, px: { xs: 2, sm: 3, lg: 4 } }}>
                <GlassPaper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}>
                        <UserAvatar
                            user={profileUser}
                            size={120}
                            sx={{
                                fontSize: '3rem',
                                border: theme.palette.mode === 'dark' ? '2px solid rgba(255, 255, 255, 0.1)' : 'none'
                            }}
                        />
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {profileUser.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                {profileUser.email}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                <Chip
                                    icon={<PersonIcon />}
                                    label={t('profile.memberSince', { date: new Date(profileUser.created_at).toLocaleDateString() })}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        ...(theme.palette.mode === 'dark' && {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            '& .MuiChip-icon': {
                                                color: 'text.secondary'
                                            }
                                        })
                                    }}
                                />
                                {!isCurrentUser && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<MessageIcon />}
                                        onClick={() => router.post(route('messages.start', profileUser.id))}
                                        sx={{ textTransform: 'none', borderRadius: '999px' }}
                                    >
                                        {t('messages.messageUser', { name: profileUser.name })}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </GlassPaper>

                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ 
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.3)' : 'primary.light',
                                    mr: 2,
                                    ...(theme.palette.mode === 'dark' && {
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    })
                                }}>
                                    <InventoryIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    {isCurrentUser ? t('items.myItems') : t('profile.userItems', { name: profileUser.name })}
                                </Typography>
                            </Box>
                            <RecentItemsGrid 
                                items={items} 
                                currentUserId={auth.user.id}
                            />
                        </Box>
                    </Grid>

                    {borrowedItems.length > 0 && (
                        <Grid size={12}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ 
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(156, 39, 176, 0.3)' : 'secondary.light',
                                        mr: 2,
                                        ...(theme.palette.mode === 'dark' && {
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        })
                                    }}>
                                        <HistoryIcon />
                                    </Avatar>
                                    <Typography variant="h6">
                                        {isCurrentUser ? t('profile.itemsBorrowing') : t('profile.userItemsBorrowing', { name: profileUser.name })}
                                    </Typography>
                                </Box>
                                <RecentItemsGrid 
                                    items={borrowedItems} 
                                    currentUserId={auth.user.id}
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </AuthenticatedLayout>
    );
} 