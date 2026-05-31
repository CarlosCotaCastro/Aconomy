import { Link, usePage } from '@inertiajs/react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Badge,
    Button,
    useTheme,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    TravelExplore as BrowseIcon,
    RequestQuote as RequestIcon,
    Inventory2 as ListingsIcon,
    SwapHoriz as BorrowedIcon,
    Group as GroupIcon,
    Settings as SettingsIcon,
    AddCircleOutline as AddIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { lightTokens } from '@/lightTheme';

export const SIDEBAR_WIDTH = 264;

export default function Sidebar({ onNavigate = () => {}, onOpenSearch = () => {} }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const badges = (usePage().props as any).badges || {};

    const isActive = (routeName) => {
        try {
            return route().current(routeName);
        } catch {
            return false;
        }
    };

    const sections = [
        {
            id: 'overview',
            label: t('navigation.sectionOverview'),
            items: [
                { id: 'dashboard', label: t('navigation.dashboard'), icon: DashboardIcon, href: 'dashboard', color: lightTokens.indigo },
                { id: 'browse', label: t('navigation.browseItems'), icon: BrowseIcon, action: onOpenSearch, color: lightTokens.lavender },
                { id: 'requests', label: t('navigation.requests'), icon: RequestIcon, href: 'borrow-requests.index', color: lightTokens.orange2, badge: badges.incomingRequests },
            ],
        },
        {
            id: 'mystuff',
            label: t('navigation.sectionMyStuff'),
            items: [
                { id: 'listings', label: t('navigation.myListings'), icon: ListingsIcon, href: 'items.index', color: lightTokens.indigo },
                { id: 'borrowed', label: t('navigation.borrowed'), icon: BorrowedIcon, href: 'lendings.index', color: lightTokens.green, badge: badges.activeBorrowings },
            ],
        },
        {
            id: 'community',
            label: t('navigation.sectionCommunity'),
            items: [
                { id: 'groups', label: t('navigation.myGroups'), icon: GroupIcon, href: 'groups.my-groups', color: lightTokens.orange2 },
                { id: 'settings', label: t('navigation.settings'), icon: SettingsIcon, href: 'profile.edit', color: lightTokens.muted },
            ],
        },
    ];

    const renderItem = (item) => {
        const active = item.href ? isActive(item.href) : false;
        const content = (
            <ListItemButton
                onClick={() => {
                    if (item.action) {
                        item.action();
                    }
                    onNavigate();
                }}
                {...(item.href
                    ? { component: Link, href: route(item.href) }
                    : {})}
                selected={active}
                sx={{
                    borderRadius: '14px',
                    px: 1.5,
                    py: 1,
                    color: 'text.primary',
                    '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,138,76,0.12)',
                        '& .MuiListItemIcon-root': { color: item.color },
                    },
                    '&:hover': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(20,20,20,0.04)',
                    },
                }}
            >
                <ListItemIcon sx={{ minWidth: 38, color: active ? item.color : 'text.secondary' }}>
                    <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: active ? 700 : 500 }}
                />
                {item.badge ? (
                    <Badge
                        badgeContent={item.badge}
                        color="warning"
                        sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none' } }}
                    />
                ) : null}
            </ListItemButton>
        );

        return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.25 }}>
                {content}
            </ListItem>
        );
    };

    return (
        <Box
            sx={{
                width: SIDEBAR_WIDTH,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                px: 2,
                py: 2.5,
            }}
        >
            <Box sx={{ px: 1, mb: 2 }} component={Link} href={route('dashboard')} onClick={onNavigate}>
                <ApplicationLogo fontSize="1.4rem" />
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {sections.map((section) => (
                    <Box key={section.id} sx={{ mb: 2 }}>
                        <Typography
                            variant="overline"
                            sx={{ px: 1.5, color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em' }}
                        >
                            {section.label}
                        </Typography>
                        <List disablePadding>{section.items.map(renderItem)}</List>
                    </Box>
                ))}
            </Box>

            <Button
                component={Link}
                href={route('items.create')}
                onClick={onNavigate}
                fullWidth
                startIcon={<AddIcon />}
                sx={{
                    mt: 1,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 700,
                    py: 1.1,
                    color: '#fff',
                    background: lightTokens.orangeGradient,
                    boxShadow: '0 10px 24px rgba(255,138,76,0.35)',
                    '&:hover': { background: lightTokens.orangeGradient, filter: 'brightness(1.05)' },
                }}
            >
                {t('navigation.listItem')}
            </Button>
        </Box>
    );
}
