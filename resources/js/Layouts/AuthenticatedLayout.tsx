import { useState, useEffect } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    Container,
    Menu,
    MenuItem,
    ListItemIcon,
    IconButton,
    useMediaQuery,
    Drawer,
    Divider,
    Badge,
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Search as SearchIcon,
    ChatBubbleOutline as MessageIcon,
} from '@mui/icons-material';
import UserAvatar from '@/Components/UserAvatar.jsx';
import NotificationMenu from '@/Components/Notifications/NotificationMenu';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Sidebar, { SIDEBAR_WIDTH } from '@/Components/Sidebar';
import GlobalSearchOverlay from '@/Components/GlobalSearchOverlay';
import { useTranslation } from 'react-i18next';
import { lightTokens } from '@/lightTheme';
import { headerPopoutMenuProps } from '@/theme/headerPopoutMenu';

export default function AuthenticatedLayout({ user, header, children }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userAnchorEl, setUserAnchorEl] = useState(null);

    const pageProps = usePage().props as any;
    const authUser = user || (pageProps.auth && pageProps.auth.user);
    const badges = pageProps.badges || {};

    const { post: logout } = useForm();

    useEffect(() => {
        const handler = () => setSearchOpen(true);
        window.addEventListener('aconomy:open-search', handler);
        return () => window.removeEventListener('aconomy:open-search', handler);
    }, []);

    const handleLogout = () => {
        logout(route('logout'), {
            onError: (errors) => {
                if (errors.status === 419) {
                    window.location.reload();
                }
            },
        });
    };

    const sidebar = (
        <Sidebar
            onNavigate={() => setMobileOpen(false)}
            onOpenSearch={() => {
                setMobileOpen(false);
                setSearchOpen(true);
            }}
        />
    );

    return (
        <div
            style={{
                background: isDark ? 'var(--bg-primary)' : theme.palette.background.default,
            }}
        >
            <div
                className={isDark ? 'custom-hero-bg-optimized' : 'light-hero-bg'}
                style={{ display: 'flex', minHeight: '100vh' }}
            >
                <CssBaseline />

                {/* Permanent sidebar (desktop) */}
                <Box
                    component="nav"
                    sx={{
                        width: { md: SIDEBAR_WIDTH },
                        flexShrink: { md: 0 },
                        display: { xs: 'none', md: 'block' },
                    }}
                >
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: SIDEBAR_WIDTH,
                            borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${lightTokens.border}`,
                            backgroundColor: isDark ? 'rgba(12,10,16,0.55)' : 'rgba(255,255,255,0.55)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {sidebar}
                    </Box>
                </Box>

                {/* Temporary sidebar (mobile) */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: SIDEBAR_WIDTH,
                            backgroundColor: isDark ? 'rgba(14,12,20,0.96)' : 'rgba(255,255,255,0.96)',
                            backdropFilter: 'blur(16px)',
                            borderRight: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${lightTokens.border}`,
                        },
                    }}
                >
                    {sidebar}
                </Drawer>

                {/* Main column */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <AppBar
                        position="sticky"
                        elevation={0}
                        sx={{
                            background: isDark ? 'rgba(11,10,16,0.55)' : 'rgba(255,255,255,0.55)',
                            backdropFilter: 'blur(10px)',
                            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${lightTokens.border}`,
                            color: isDark ? 'white' : 'text.primary',
                        }}
                    >
                        <Toolbar sx={{ gap: 1 }}>
                            {isMobile && (
                                <IconButton
                                    color="inherit"
                                    aria-label={t('navigation.openMenu')}
                                    edge="start"
                                    onClick={() => setMobileOpen(true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}

                            {/* Search trigger */}
                            <Box
                                role="button"
                                tabIndex={0}
                                onClick={() => setSearchOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSearchOpen(true);
                                    }
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flexGrow: 1,
                                    maxWidth: 520,
                                    px: 2,
                                    py: 0.9,
                                    cursor: 'pointer',
                                    borderRadius: '999px',
                                    color: 'text.secondary',
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${lightTokens.border}`,
                                    '&:hover': {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#fff',
                                    },
                                }}
                            >
                                <SearchIcon fontSize="small" />
                                <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
                                    {t('search.trigger')}
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

                            <Tooltip title={t('messages.title')}>
                                <IconButton color="inherit" onClick={() => router.visit(route('messages.index'))}>
                                    <Badge badgeContent={badges.unreadMessages || 0} color="error">
                                        <MessageIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <NotificationMenu />
                            <LanguageSwitcher />

                            <IconButton
                                size="large"
                                aria-label="account"
                                aria-haspopup="true"
                                onClick={(e) => setUserAnchorEl(e.currentTarget)}
                                color="inherit"
                            >
                                <UserAvatar user={authUser} size={32} />
                            </IconButton>
                            <Menu
                                anchorEl={userAnchorEl}
                                id="account-menu"
                                open={Boolean(userAnchorEl)}
                                onClose={() => setUserAnchorEl(null)}
                                {...headerPopoutMenuProps}
                                slotProps={{
                                    ...headerPopoutMenuProps.slotProps,
                                    paper: {
                                        ...headerPopoutMenuProps.slotProps?.paper,
                                        elevation: 2,
                                        sx: { width: 220 },
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={() => setUserAnchorEl(null)}
                                    component={Link}
                                    href={route('profile.edit')}
                                    sx={{ borderRadius: 4, mx: 0.5 }}
                                >
                                    <ListItemIcon>
                                        <SettingsIcon fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    {t('navigation.profileSettings')}
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" color="error" />
                                    </ListItemIcon>
                                    {t('common.logout')}
                                </MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>

                    <Box component="main" sx={{ flexGrow: 1, p: { xs: 1.5, sm: 3 } }}>
                        {header && <Box sx={{ mb: 2 }}>{header}</Box>}
                        <Container disableGutters maxWidth="lg" sx={{ py: 1 }}>
                            {children}
                        </Container>
                    </Box>

                    <Box
                        component="footer"
                        sx={{
                            py: 3,
                            px: 2,
                            mt: 'auto',
                            textAlign: 'center',
                            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${lightTokens.border}`,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            © {new Date().getFullYear()} Aconomy - Item Lending Platform
                        </Typography>
                    </Box>
                </Box>

                <GlobalSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
            </div>
        </div>
    );
}
