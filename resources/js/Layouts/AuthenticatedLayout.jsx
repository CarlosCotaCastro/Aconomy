import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
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
    Tooltip,
    IconButton,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    useTheme,
    Paper,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    Group as GroupIcon,
    SwapHoriz as SwapHorizIcon,
    Add as AddIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
    Home as HomeIcon,
    RequestQuote as RequestQuoteIcon,
} from '@mui/icons-material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import NotificationMenu from '@/Components/Notifications/NotificationMenu';

export default function AuthenticatedLayout({ user, children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [itemsAnchorEl, setItemsAnchorEl] = useState(null);
    const [groupsAnchorEl, setGroupsAnchorEl] = useState(null);
    const [lendingsAnchorEl, setLendingsAnchorEl] = useState(null);
    const [borrowRequestsAnchorEl, setBorrowRequestsAnchorEl] = useState(null);
    const [userAnchorEl, setUserAnchorEl] = useState(null);

    // Fallback to usePage if user prop is not provided
    const pageProps = usePage().props;
    const authUser = user || (pageProps.auth && pageProps.auth.user);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleItemsMenuOpen = (event) => {
        setItemsAnchorEl(event.currentTarget);
    };

    const handleGroupsMenuOpen = (event) => {
        setGroupsAnchorEl(event.currentTarget);
    };

    const handleLendingsMenuOpen = (event) => {
        setLendingsAnchorEl(event.currentTarget);
    };

    const handleBorrowRequestsMenuOpen = (event) => {
        setBorrowRequestsAnchorEl(event.currentTarget);
    };

    const handleUserMenuOpen = (event) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setItemsAnchorEl(null);
        setGroupsAnchorEl(null);
        setLendingsAnchorEl(null);
        setBorrowRequestsAnchorEl(null);
        setUserAnchorEl(null);
    };

    const drawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
            <Box sx={{ py: 2, px: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#5271ff' }}>
                    Aconomy
                </Typography>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('dashboard')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <HomeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                <ListItem sx={{ mt: 1.5, mb: 0.5, px: 3 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Items
                    </Typography>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('items.index')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <InventoryIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="My Items" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('items.create')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <AddIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Add Item" />
                    </ListItemButton>
                </ListItem>

                <ListItem sx={{ mt: 1.5, mb: 0.5, px: 3 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Groups
                    </Typography>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('groups.my-groups')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <GroupIcon sx={{ color: '#ff9800' }} />
                        </ListItemIcon>
                        <ListItemText primary="My Groups" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('groups.create')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <AddIcon sx={{ color: '#ff9800' }} />
                        </ListItemIcon>
                        <ListItemText primary="Create Group" />
                    </ListItemButton>
                </ListItem>

                <ListItem sx={{ mt: 1.5, mb: 0.5, px: 3 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Lendings
                    </Typography>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('lendings.index')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <SwapHorizIcon sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText primary="My Lendings" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('lendings.create')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <AddIcon sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText primary="Lend Item" />
                    </ListItemButton>
                </ListItem>

                <ListItem sx={{ mt: 1.5, mb: 0.5, px: 3 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Borrow Requests
                    </Typography>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href={route('borrow-requests.index')} sx={{ borderRadius: '0 20px 20px 0', mx: 1 }}>
                        <ListItemIcon>
                            <RequestQuoteIcon sx={{ color: '#9c27b0' }} />
                        </ListItemIcon>
                        <ListItemText primary="My Requests" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
        }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'linear-gradient(127deg, #c4d4ff 43.7%, #8b497e)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    color: 'text.primary',
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
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #5271ff 0%, #4361ee 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textDecoration: 'none',
                            flexGrow: { xs: 1, md: 0 },
                            mr: 3,
                            fontSize: { xs: '1.2rem', md: '1.5rem' }
                        }}
                    >
                        Aconomy
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', flexGrow: 1, gap: 1.5 }}>
                            <Button
                                component={Link}
                                href={route('dashboard')}
                                variant="text"
                                color="inherit"
                                startIcon={<HomeIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px'
                                }}
                            >
                                Home
                            </Button>

                            <Button
                                color="inherit"
                                aria-controls="items-menu"
                                aria-haspopup="true"
                                onClick={handleItemsMenuOpen}
                                endIcon={<ArrowDropDownIcon />}
                                startIcon={<InventoryIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px'
                                }}
                            >
                                Items
                            </Button>
                            <Menu
                                id="items-menu"
                                anchorEl={itemsAnchorEl}
                                keepMounted
                                open={Boolean(itemsAnchorEl)}
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
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('items.index')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    My Items
                                </MenuItem>
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('items.create')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    Add New Item
                                </MenuItem>
                            </Menu>

                            <Button
                                color="inherit"
                                aria-controls="groups-menu"
                                aria-haspopup="true"
                                onClick={handleGroupsMenuOpen}
                                endIcon={<ArrowDropDownIcon />}
                                startIcon={<GroupIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px'
                                }}
                            >
                                Groups
                            </Button>
                            <Menu
                                id="groups-menu"
                                anchorEl={groupsAnchorEl}
                                keepMounted
                                open={Boolean(groupsAnchorEl)}
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
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('groups.my-groups')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    My Groups
                                </MenuItem>
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('groups.index')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    Find Groups
                                </MenuItem>
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('groups.create')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    Create New Group
                                </MenuItem>
                            </Menu>

                            <Button
                                color="inherit"
                                aria-controls="lendings-menu"
                                aria-haspopup="true"
                                onClick={handleLendingsMenuOpen}
                                endIcon={<ArrowDropDownIcon />}
                                startIcon={<SwapHorizIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px'
                                }}
                            >
                                Lendings
                            </Button>
                            <Menu
                                id="lendings-menu"
                                anchorEl={lendingsAnchorEl}
                                keepMounted
                                open={Boolean(lendingsAnchorEl)}
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
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('lendings.index')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    My Lendings
                                </MenuItem>
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('lendings.create')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    Lend an Item
                                </MenuItem>
                            </Menu>

                            <Button
                                color="inherit"
                                aria-controls="borrow-requests-menu"
                                aria-haspopup="true"
                                onClick={handleBorrowRequestsMenuOpen}
                                endIcon={<ArrowDropDownIcon />}
                                startIcon={<RequestQuoteIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px'
                                }}
                            >
                                Borrow Requests
                            </Button>
                            <Menu
                                id="borrow-requests-menu"
                                anchorEl={borrowRequestsAnchorEl}
                                keepMounted
                                open={Boolean(borrowRequestsAnchorEl)}
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
                                <MenuItem
                                    onClick={handleMenuClose}
                                    component={Link}
                                    href={route('borrow-requests.index')}
                                    sx={{ borderRadius: 1, mx: 0.5 }}
                                >
                                    My Requests
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}

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
                            <Avatar alt={authUser.name}>{authUser.name.charAt(0)}</Avatar>
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
                                Profile Settings
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={handleMenuClose}
                            >
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full text-left flex items-center"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" color="error" />
                                    </ListItemIcon>
                                    Logout
                                </Link>
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
                        width: 250,
                        boxShadow: 'none'
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
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
                    //backgroundColor: 'white',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    textAlign: 'center'
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Aconomy - Item Lending Platform
                </Typography>
            </Box>
        </Box>
    );
}
