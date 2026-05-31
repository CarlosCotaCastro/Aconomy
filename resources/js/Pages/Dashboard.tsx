import { Link } from '@inertiajs/react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Chip,
    Avatar,
    ListItemAvatar,
    IconButton,
    Divider, useTheme,
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    Group as GroupIcon,
    SwapHoriz as SwapHorizIcon,
    AddCircle as AddCircleIcon,
    ArrowForward as ArrowForwardIcon,
    Circle as CircleIcon,
    Person as PersonIcon, ChevronRight,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GroupItemSearch from "@/Components/GroupItemSearch.jsx";
import { useTranslation } from 'react-i18next';
import React from 'react';
import { lightTokens } from '@/lightTheme';


export default function Dashboard({ items = [], groups = [], lendings = [], borrowings = [], auth }) {
    const { t } = useTranslation();
    const activeLendings = lendings.filter(l => !l.returned_at);
    const activeBorrowings = borrowings.filter(l => !l.returned_at);

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

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

    function stringAvatar(name) {
        const wordcount = name.split(' ').length;
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: (wordcount === 1)
                ? name[0].toUpperCase()
                : `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const isApprovedMember = groups.some(group =>
        group.users.find(u => u.id === auth.user.id)?.pivot.approved
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Grid container spacing={3}>
                {/* Main content card (2/3 width) */}
                <Grid item size={{ xs: 12, md: 12 }}>

                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        {t('dashboard.welcomeBack', { name: auth.user.name })}
                    </Typography>
                    <Box sx={{ minHeight: '40vh' }}>
                        <GroupItemSearch isApprovedMember={isApprovedMember} rounded={true} />
                    </Box>

                </Grid>
                {/* Sidebar (1/3 width) */}
                <Grid item size={{ xs: 12, md: 12 }}>

                    <Grid container spacing={2}>

                        {/* Active Lendings/Borrowings */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{
                                    bgcolor: isDark ? 'rgba(76, 175, 80, 0.1)' : 'rgba(126, 180, 135, 0.15)',
                                    mr: 2,
                                    width: 48,
                                    height: 48
                                }}>
                                    <SwapHorizIcon sx={{ color: isDark ? '#4caf50' : lightTokens.green }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {t('lendings.activeLendings')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {activeLendings.length + activeBorrowings.length} {t('lendings.activeItems')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            <List sx={{ mb: 2 }}>
                                {activeLendings.slice(0, 2).map((lending) => (
                                    <ListItem
                                        key={lending.id}
                                        component={Link}
                                        href={route('lendings.show', lending.id)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{
                                                bgcolor: isDark ? 'rgba(76, 175, 80, 0.1)' : 'rgba(126, 180, 135, 0.15)',
                                            }}>
                                                <PersonIcon sx={{ color: isDark ? '#4caf50' : lightTokens.green }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {lending.item.name}
                                                </Typography>
                                            }
                                            secondary={t('lendings.borrowedBy', { name: lending.borrower.name })}
                                        />
                                        <Chip
                                            label={t('lendings.lent')}
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                backgroundColor: isDark ? 'rgba(76, 175, 80, 0.1)' : 'rgba(126, 180, 135, 0.15)',
                                                color: isDark ? '#4caf50' : lightTokens.green,
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                {activeBorrowings.slice(0, 2).map((lending) => (
                                    <ListItem
                                        key={lending.id}
                                        component={Link}
                                        href={route('lendings.show', lending.id)}
                                        disablePadding={true}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{
                                                bgcolor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(157, 125, 255, 0.15)',
                                            }}>
                                                <PersonIcon sx={{ color: isDark ? '#8b5cf6' : lightTokens.lavender }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {lending.item.name}
                                                </Typography>
                                            }
                                            secondary={t('lendings.borrowedFrom', { name: lending.lender.name })}
                                        />
                                        <Chip
                                            label={t('lendings.borrowed')}
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(157, 125, 255, 0.15)',
                                                color: isDark ? '#8b5cf6' : lightTokens.lavender,
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                {activeLendings.length === 0 && activeBorrowings.length === 0 && (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('lendings.noActiveLendings')}
                                        </Typography>
                                    </Box>
                                )}
                                {(activeLendings.length + activeBorrowings.length) > 4 && (
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Button
                                            component={Link}
                                            href={route('lendings.index')}
                                            endIcon={<ChevronRight />}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {t('common.viewAll', { type: t('lendings.lendings') })}
                                        </Button>
                                    </Box>
                                )}
                            </List>
                        </Grid>
                        {/* My Groups */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{
                                    bgcolor: isDark ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 138, 76, 0.15)',
                                    mr: 2,
                                    width: 48,
                                    height: 48
                                }}>
                                    <GroupIcon sx={{ color: isDark ? '#ff9800' : lightTokens.orange2 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {t('dashboard.myGroups')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {groups.length} {t('groups.groupsJoined')}
                                    </Typography>
                                </Box>
                                <IconButton
                                    component={Link}
                                    href={route('groups.create')}
                                    variant="outlined"
                                    color={'warning'}
                                    fullWidth
                                    startIcon={<AddCircleIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        p: 1,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        alignSelf: 'flex-end',
                                    }}
                                    title={t('groups.createNewGroup')}
                                >
                                    <AddCircleIcon />
                                </IconButton>
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            <List sx={{ mb: 2 }}>
                                {groups && groups.slice(0, 3).map((group) => (
                                    <ListItem
                                        key={group.id}
                                        component={Link}
                                        href={route('groups.show', group.id)}
                                        disablePadding
                                        sx={{
                                            mb: 1,
                                            borderRadius: isDark ? 2 : '18px',
                                            p: 1,
                                            textDecoration: 'none',
                                            color: 'inherit'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar {...stringAvatar(group.name)} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {group.name}
                                                </Typography>
                                            }
                                            secondary={`${group.users.filter(u => u.pivot.approved).length} ${t('groups.members')}`}
                                        />
                                        <Chip
                                            label={group.users.find(u => u.id === auth.user.id)?.pivot.approved ? t('common.approved') : t('common.pending')}
                                            color={group.users.find(u => u.id === auth.user.id)?.pivot.approved ? 'success' : 'default'}
                                            size="small"
                                            variant={'filled'}
                                            sx={{
                                                ml: 1,
                                                ...(group.users.find(u => u.id === auth.user.id)?.pivot.approved
                                                    ? { color: theme.palette.common.white }
                                                    : {})
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                {groups.length === 0 && (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('dashboard.noGroups')}
                                        </Typography>
                                    </Box>
                                )}
                                {groups.length > 3 && (
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Button
                                            component={Link}
                                            href={route('groups.index')}
                                            endIcon={<ChevronRight />}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {t('common.viewAll', { count: groups.length, type: t('groups.groups') })}
                                        </Button>
                                    </Box>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
}
