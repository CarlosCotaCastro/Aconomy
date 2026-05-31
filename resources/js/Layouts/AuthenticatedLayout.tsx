import { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    Button,
    Container,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    IconButton,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    useTheme,
} from '@mui/material';
import UserAvatar from '@/Components/UserAvatar.jsx';
import {
    Menu as MenuIcon,
    Inventory as InventoryIcon,
    Group as GroupIcon,
    SwapHoriz as SwapHorizIcon,
    Add as AddIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Search as SearchIcon,
    Home as HomeIcon,
    RequestQuote as RequestQuoteIcon,
} from '@mui/icons-material';

import NotificationMenu from '@/Components/Notifications/NotificationMenu';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTranslation } from 'react-i18next';

// Logo color palette - extracted from the actual circular logo
const LOGO_COLORS = {
    lightBlue: '#4A90E2',   // Bright blue from left side of logo
    blue: '#1E90FF',        // Primary blue from logo gradient
    purple: '#6A4C93',      // Deep purple from right side of logo  
    darkPurple: '#5A3D6B',  // Darker purple variant
    accent: '#7B68EE'       // Medium slate blue accent
};

// Unified navigation configuration
const getNavigationConfig = (t) => [
    {
        id: 'items',
        label: t('navigation.items'),
        icon: InventoryIcon,
        type: 'menu',
        showOnDesktop: true,
        showOnMobile: true,
        color: LOGO_COLORS.lightBlue, // Bright blue from logo left side
        items: [
            {
                id: 'my-items',
                label: t('navigation.myItems'),
                href: 'items.index',
                icon: InventoryIcon
            },
            {
                id: 'add-item',
                label: t('navigation.addNewItem'),
                href: 'items.create',
                icon: AddIcon
            }
        ]
    },
    {
        id: 'groups',
        label: t('navigation.groups'),
        icon: GroupIcon,
        type: 'menu',
        showOnDesktop: true,
        showOnMobile: true,
        color: LOGO_COLORS.accent, // Medium slate blue from logo
        items: [
            {
                id: 'my-groups',
                label: t('navigation.myGroups'),
                href: 'groups.my-groups',
                icon: GroupIcon
            },
            {
                id: 'find-groups',
                label: t('navigation.findGroups'),
                href: 'groups.index',
                icon: SearchIcon
            },
            {
                id: 'create-group',
                label: t('navigation.createNewGroup'),
                href: 'groups.create',
                icon: AddIcon
            }
        ]
    },
    {
        id: 'lendings',
        label: t('navigation.lendings'),
        icon: SwapHorizIcon,
        type: 'menu',
        showOnDesktop: true,
        showOnMobile: true,
        color: LOGO_COLORS.purple, // Deep purple from logo right side
        items: [
            {
                id: 'my-lendings',
                label: t('navigation.myLendings'),
                href: 'lendings.index',
                icon: SwapHorizIcon
            },
            {
                id: 'my-requests',
                label: t('navigation.myRequests'),
                href: 'borrow-requests.index',
                icon: RequestQuoteIcon
            }
        ]
    }
];

export default function AuthenticatedLayout({ user, children }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuAnchors, setMenuAnchors] = useState({});
    const [userAnchorEl, setUserAnchorEl] = useState(null);
    
    // Get navigation configuration
    const navigationConfig = getNavigationConfig(t);

    // Fallback to usePage if user prop is not provided
    const pageProps = usePage().props;
    const authUser = user || (pageProps.auth && pageProps.auth.user);

    // Logout form
    const { post: logout } = useForm();

    const handleLogout = () => {
        logout(route('logout'), {
            onSuccess: () => {
                handleMenuClose();
            },
            onError: (errors) => {
                console.error('Logout error:', errors);
                // If CSRF token error, reload the page
                if (errors.status === 419) {
                    window.location.reload();
                }
            },
        });
    };



    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (menuId, event) => {
        setMenuAnchors(prev => ({
            ...prev,
            [menuId]: event.currentTarget
        }));
    };

    const handleUserMenuOpen = (event) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchors({});
        setUserAnchorEl(null);
    };

    // Render mobile navigation items
    const renderMobileNavigation = () => {
        return navigationConfig
            .filter(item => item.showOnMobile)
            .map(section => (
                <div key={section.id}>
                    <ListItem sx={{ mt: 1.5, mb: 0.5, px: 3 }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            {section.label}
                        </Typography>
                    </ListItem>
                    {section.items.map(item => (
                        <ListItem key={item.id} disablePadding>
                            <ListItemButton 
                                component={Link} 
                                href={route(item.href)} 
                                sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}
                            >
                                <ListItemIcon>
                                    <item.icon sx={{ color: section.color }} />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </div>
            ));
    };

    // Render desktop navigation items
    const renderDesktopNavigation = () => {
        return navigationConfig
            .filter(item => item.showOnDesktop)
            .map(item => {
                if (item.type === 'single') {
                    return (
                        <Button
                            key={item.id}
                            component={Link}
                            href={route(item.href)}
                            variant="text"
                            color="inherit"
                            startIcon={<item.icon />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '8px'
                            }}
                        >
                            {item.label}
                        </Button>
                    );
                } else {
                    return (
                        <div key={item.id}>
                            <Button
                                color="inherit"
                                aria-controls={`${item.id}-menu`}
                                aria-haspopup="true"
                                onClick={(e) => handleMenuOpen(item.id, e)}
                                endIcon={<ArrowDropDownIcon />}
                                startIcon={<item.icon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px'
                                }}
                            >
                                {item.label}
                            </Button>
                            <Menu
                                id={`${item.id}-menu`}
                                anchorEl={menuAnchors[item.id]}
                                keepMounted
                                open={Boolean(menuAnchors[item.id])}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 2,
                                    sx: {
                                        mt: 1.5,
                                        width: 200,
                                        borderRadius: 2
                                    }
                                }}
                            >
                                {item.items.map(subItem => (
                                    <MenuItem
                                        key={subItem.id}
                                        onClick={handleMenuClose}
                                        component={Link}
                                        href={route(subItem.href)}
                                        sx={{ borderRadius: 1, mx: 0.5 }}
                                    >
                                        {subItem.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>
                    );
                }
            });
    };

    const drawerContent = (
        <Box sx={{ width: '100%' }} role="presentation" onClick={handleDrawerToggle}>
            <List>
                {renderMobileNavigation()}
            </List>
        </Box>
    );

    return (
        <div style={{ 
            background: theme.palette.mode === 'dark' ? "var(--bg-primary)" : theme.palette.background.default 
        }}>
            <div className={theme.palette.mode === 'dark' ? "custom-hero-bg-optimized" : "light-hero-bg"} style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
                <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(to right, #0b0a10, #260e1f)' 
                        : 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(20,20,20,0.06)',
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        href={route('dashboard')}
                        sx={{
                            flexGrow: { xs: 1, md: 0 },
                            mr: 3,
                            fontSize: { xs: '1.2rem', md: '1.5rem' }
                        }}
                    >
                        <ApplicationLogo fontSize="1.5rem" />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                        {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                {renderDesktopNavigation()}
                            </Box>
                        )}
                        <LanguageSwitcher />
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                        <NotificationMenu />
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleUserMenuOpen}
                            color="inherit"
                        >
                            <UserAvatar user={authUser} size={32} />
                        </IconButton>
                        <Menu
                            anchorEl={userAnchorEl}
                            id="account-menu"
                            open={Boolean(userAnchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                elevation: 2,
                                sx: {
                                    overflow: 'visible',
                                    mt: 1.5,
                                    width: 220,
                                    borderRadius: 2,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem
                                onClick={handleMenuClose}
                                component={Link}
                                href={route('profile.edit')}
                                sx={{ borderRadius: 1, mx: 0.5 }}
                            >
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" color="primary" />
                                </ListItemIcon>
                                {t('navigation.profileSettings')}
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={handleLogout}
                            >
                                <div className="w-full text-left flex items-center">
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" color="error" />
                                    </ListItemIcon>
                                    {t('common.logout')}
                                </div>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: '90%',
                        boxShadow: 'none',
                        backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(14, 73, 156, 0.3)' 
                            : 'rgba(255, 255, 255, 0.74)',
                        backdropFilter: theme.palette.mode === 'dark' ? 'blur(20px)' : 'blur(10px)',
                        borderRight: theme.palette.mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.1)' 
                            : '1px solid rgba(20, 20, 20, 0.08)',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 0, sm: 3 },
                    mt: 8,
                }}
            >
                <Container
                    sx={{
                        py: 2,
                    }}
                >

                        {children}

                </Container>
            </Box>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.02)' 
                        : 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(10px)',
                    borderTop: theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(20, 20, 20, 0.06)',
                    textAlign: 'center'
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Aconomy - Item Lending Platform
                </Typography>
            </Box>
            </div>
        </div>
    );
}
