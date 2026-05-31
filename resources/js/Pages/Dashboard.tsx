import { Link, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Avatar,
    Divider,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    Inventory2 as InventoryIcon,
    SwapHoriz as SwapHorizIcon,
    Group as GroupIcon,
    RequestQuote as RequestIcon,
    ChevronRight,
    NotificationsNone as ActivityIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    AddCircle as AddCircleIcon,
    ChatBubbleOutline as MessageIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPaper from '@/Components/GlassPaper';
import UserAvatar from '@/Components/UserAvatar.jsx';
import OnboardingEmptyState from '@/Components/OnboardingEmptyState';
import { useTranslation } from 'react-i18next';
import { lightTokens } from '@/lightTheme';
import { dueInfo } from '@/utils/dueDate';

function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

export default function Dashboard({
    items = [],
    groups = [],
    lendings = [],
    borrowings = [],
    incomingRequests = [],
    recentActivity = [],
    auth,
}) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const activeLendings = lendings.filter((l) => !l.returned_at);
    const activeBorrowings = borrowings.filter((l) => !l.returned_at);

    const isApprovedMember = groups.some(
        (group) => group.users?.find((u) => u.id === auth.user.id)?.pivot?.approved,
    );

    // First-time orientation: no items and not an approved member anywhere.
    if (items.length === 0 && !isApprovedMember) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <OnboardingEmptyState
                    name={auth.user.name}
                    onBrowse={() => window.dispatchEvent(new Event('aconomy:open-search'))}
                />
            </AuthenticatedLayout>
        );
    }

    const severityColor = (severity) => {
        if (severity === 'overdue') return theme.palette.error.main;
        if (severity === 'soon') return isDark ? '#ff9800' : lightTokens.orange3;
        return isDark ? '#4caf50' : lightTokens.green;
    };

    const dueLabel = (info) => {
        if (!info) return t('lendings.noDueDate');
        if (info.relativeKey === 'dueOn') return t('dashboard.dueOn', { date: info.formatted });
        return t(`dashboard.${info.relativeKey}`);
    };

    // Soonest-due active borrowing drives the return reminder card.
    const reminderBorrowing = [...activeBorrowings]
        .filter((l) => l.due_at)
        .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())[0];

    const stats = [
        { id: 'items', icon: InventoryIcon, color: lightTokens.indigo, value: items.length, label: t('dashboard.statItemsShared') },
        { id: 'borrowing', icon: SwapHorizIcon, color: lightTokens.green, value: activeBorrowings.length, label: t('dashboard.statBorrowing') },
        { id: 'groups', icon: GroupIcon, color: lightTokens.orange2, value: groups.length, label: t('dashboard.statGroups') },
        { id: 'requests', icon: RequestIcon, color: lightTokens.lavender, value: incomingRequests.length, label: t('dashboard.statRequests') },
    ];

    const sectionTitle = (title, action) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
            {action}
        </Box>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {t('dashboard.welcomeBack', { name: auth.user.name })}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('dashboard.dashboardOverview')}
            </Typography>

            {/* Stat cards */}
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, mb: 3 }}>
                {stats.map((stat) => (
                    <GlassPaper key={stat.id} sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(20,20,20,0.04)', color: stat.color, width: 46, height: 46 }}>
                            <stat.icon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{stat.value}</Typography>
                            <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                        </Box>
                    </GlassPaper>
                ))}
            </Box>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
                {/* Left column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Incoming requests */}
                    <GlassPaper>
                        {sectionTitle(
                            t('dashboard.incomingRequests'),
                            <Button component={Link} href={route('borrow-requests.index')} endIcon={<ChevronRight />} sx={{ textTransform: 'none' }}>
                                {t('dashboard.seeAll')}
                            </Button>,
                        )}
                        {incomingRequests.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                {t('dashboard.noIncomingRequests')}
                            </Typography>
                        ) : (
                            incomingRequests.slice(0, 4).map((req) => {
                                const info = dueInfo(req.requested_due_at);
                                return (
                                    <Box key={req.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25 }}>
                                        <UserAvatar user={req.borrower} size={40} />
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                                <Box component="span" sx={{ fontWeight: 700 }}>{req.borrower.name}</Box>{' '}
                                                {t('dashboard.wants')}{' '}
                                                <Box component="span" sx={{ fontWeight: 700 }}>{req.item.name}</Box>
                                            </Typography>
                                            {info && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('borrowRequests.dueBack', { date: info.formatted })}
                                                </Typography>
                                            )}
                                        </Box>
                                        <IconButton
                                            size="small"
                                            color="success"
                                            onClick={() => router.post(route('borrow-requests.approve', req.id))}
                                            aria-label={t('borrowRequests.approveRequest')}
                                        >
                                            <CheckIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => router.post(route('borrow-requests.deny', req.id))}
                                            aria-label={t('borrowRequests.denyRequest')}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                );
                            })
                        )}
                    </GlassPaper>

                    {/* You're borrowing */}
                    <GlassPaper>
                        {sectionTitle(
                            t('dashboard.youreBorrowing'),
                            <Button component={Link} href={route('lendings.index')} endIcon={<ChevronRight />} sx={{ textTransform: 'none' }}>
                                {t('dashboard.history')}
                            </Button>,
                        )}
                        {activeBorrowings.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                {t('lendings.noActiveLendings')}
                            </Typography>
                        ) : (
                            activeBorrowings.slice(0, 4).map((lending) => {
                                const info = dueInfo(lending.due_at);
                                return (
                                    <Box key={lending.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25 }}>
                                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(157,125,255,0.15)', color: isDark ? '#8b5cf6' : lightTokens.lavender }}>
                                            <InventoryIcon />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>{lending.item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {t('lendings.borrowedFrom', { name: lending.lender.name })}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            size="small"
                                            label={dueLabel(info)}
                                            sx={{ backgroundColor: 'transparent', border: `1px solid ${severityColor(info?.severity)}`, color: severityColor(info?.severity), fontWeight: 600 }}
                                        />
                                        <Button
                                            component={Link}
                                            href={route('lendings.show', lending.id)}
                                            size="small"
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {t('dashboard.return')}
                                        </Button>
                                    </Box>
                                );
                            })
                        )}
                    </GlassPaper>
                </Box>

                {/* Right column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Return reminder */}
                    {reminderBorrowing && (() => {
                        const info = dueInfo(reminderBorrowing.due_at);
                        return (
                            <GlassPaper
                                sx={{
                                    background: isDark ? 'linear-gradient(135deg, rgba(255,138,76,0.25), rgba(91,108,255,0.2))' : 'linear-gradient(135deg, #ffb36b 0%, #ff8a4c 60%, #ff7fa8 100%)',
                                    color: isDark ? 'text.primary' : '#fff',
                                    border: 'none',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <SwapHorizIcon />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('dashboard.returnReminder')}</Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                                    {t('dashboard.returnReminderText', {
                                        item: reminderBorrowing.item.name,
                                        name: reminderBorrowing.lender.name,
                                        when: dueLabel(info),
                                    })}
                                </Typography>
                                <Button
                                    fullWidth
                                    startIcon={<MessageIcon />}
                                    onClick={() => router.post(route('messages.start', reminderBorrowing.lender.id))}
                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '999px', backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.92)', color: isDark ? 'text.primary' : lightTokens.orange3, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : '#fff' } }}
                                >
                                    {t('messages.messageUser', { name: reminderBorrowing.lender.name })}
                                </Button>
                            </GlassPaper>
                        );
                    })()}

                    {/* Your groups */}
                    <GlassPaper>
                        {sectionTitle(
                            t('dashboard.yourGroups'),
                            <IconButton component={Link} href={route('groups.create')} color="warning" size="small" aria-label={t('groups.createNewGroup')}>
                                <AddCircleIcon />
                            </IconButton>,
                        )}
                        {groups.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                {t('dashboard.noGroups')}
                            </Typography>
                        ) : (
                            groups.slice(0, 4).map((group) => {
                                const approved = group.users?.find((u) => u.id === auth.user.id)?.pivot?.approved;
                                return (
                                    <Box key={group.id} component={Link} href={route('groups.show', group.id)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, textDecoration: 'none', color: 'inherit' }}>
                                        <Avatar sx={{ bgcolor: stringToColor(group.name), width: 38, height: 38 }}>
                                            {group.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{group.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {group.users?.filter((u) => u.pivot?.approved).length} {t('groups.members')}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            size="small"
                                            label={approved ? t('common.approved') : t('common.pending')}
                                            color={approved ? 'success' : 'default'}
                                            sx={approved ? { color: theme.palette.common.white } : {}}
                                        />
                                    </Box>
                                );
                            })
                        )}
                        {groups.length > 4 && (
                            <Box sx={{ textAlign: 'right', mt: 1 }}>
                                <Button component={Link} href={route('groups.index')} endIcon={<ChevronRight />} sx={{ textTransform: 'none' }}>
                                    {t('dashboard.seeAll')}
                                </Button>
                            </Box>
                        )}
                    </GlassPaper>

                    {/* Recent activity */}
                    <GlassPaper>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <ActivityIcon fontSize="small" color="action" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('dashboard.recentActivity')}</Typography>
                        </Box>
                        {recentActivity.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                {t('dashboard.noActivity')}
                            </Typography>
                        ) : (
                            recentActivity.map((activity, idx) => (
                                <Box key={activity.id}>
                                    {idx > 0 && <Divider sx={{ my: 1 }} />}
                                    <Box sx={{ py: 0.5 }}>
                                        <Typography variant="body2">
                                            {activity.data?.body || activity.data?.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: true })}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </GlassPaper>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
