import {Link, router, useForm} from '@inertiajs/react';
import {
    Box,
    Button,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Chip,
    IconButton, Tooltip, useTheme, Pagination,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect, useState, useCallback} from "react";
import { useTranslation } from 'react-i18next';
import GlassPaper from '@/Components/GlassPaper';
import GroupAvatar from '@/Components/GroupAvatar';
import GroupBanner from '@/Components/GroupBanner';
import { isPivotApproved } from '@/utils/groupMembership';
import debounce from 'lodash/debounce';

export default function Index({ groups, auth, filters = {} }) {
    const { t } = useTranslation();
    const { post, processing } = useForm();
    const theme = useTheme();
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [filterType, setFilterType] = useState(filters.filter || 'all');
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((search, filter) => {
            setIsSearching(true);
            router.get(
                route('groups.index'),
                { 
                    search: search || undefined,
                    filter: filter || 'all'
                },
                { 
                    preserveScroll: true, 
                    preserveState: true,
                    onFinish: () => setIsSearching(false)
                }
            );
        }, 300),
        []
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value, filterType);
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilterType(value);
        debouncedSearch(searchQuery, value);
    };
    const handleJoinGroup = (groupId) => {
        post(route('groups.join', groupId));
    };

    const handlePageChange = (event, page) => {
        router.get(
            route(route().current()),
            { 
                page: page,
                search: searchQuery || undefined,
                filter: filterType || 'all'
            },
            { preserveScroll: true, preserveState: true }
        );
    };

    useEffect(() => {
        console.log(groups);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Typography variant="h4" component="h1">
                    {t('groups.groups')}
                </Typography>
                <Box sx={{ flexShrink: 0 }}>
                    <PrimaryButton
                        component={Link}
                        href={route('groups.create')}
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            width: { xs: '100%', sm: 'auto' },
                            marginTop: { xs: 0, sm: 0 },
                            flexShrink: 0,
                        }}
                    >
                        {t('groups.createNewGroup')}
                    </PrimaryButton>
                </Box>
            </Box>

            {/* Main Content Layout */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 3
            }}>
                {/* Search and Filter Form - 1/3 width on large screens */}
                <Box sx={{ 
                    width: { xs: '100%', lg: '33.333%' },
                    flexShrink: 0
                }}>
                    <GlassPaper sx={{ p: 3, mb: { xs: 3, lg: 0 } }}>
                        <Typography variant="h6" gutterBottom>
                            {t('common.search')} & {t('common.filter')}
                        </Typography>
                        
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder={t('groups.searchGroups')}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: isSearching && (
                                    <InputAdornment position="end">
                                        <CircularProgress size={20} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>{t('common.filter')}</InputLabel>
                            <Select
                                value={filterType}
                                label={t('common.filter')}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="all">{t('groups.filterAll')}</MenuItem>
                                <MenuItem value="my_groups">{t('groups.filterMyGroups')}</MenuItem>
                                <MenuItem value="discover">{t('groups.filterDiscover')}</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Results count */}
                        {groups.data && groups.data.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {t('groups.groupsFound', { count: groups.total })}
                                </Typography>
                            </Box>
                        )}
                    </GlassPaper>
                </Box>

                {/* Search Results - 2/3 width on large screens */}
                <Box sx={{ 
                    width: { xs: '100%', lg: '66.667%' },
                    flexGrow: 1
                }}>
                    {/* No results message */}
                    {groups.data && groups.data.length === 0 && (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            color: 'text.secondary'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                {t('groups.noGroupsFound')}
                            </Typography>
                            <Typography variant="body2">
                                {searchQuery || filterType !== 'all' 
                                    ? t('common.tryAdjustingSearch') 
                                    : t('groups.noGroupsYet')}
                            </Typography>
                        </Box>
                    )}

                    {/* Groups Grid */}
                    <Grid container spacing={3}>
                {groups.data && groups.data.map((group) => {
                    // Count approved and pending members
                    const approvedMembers = group.users.filter(u => isPivotApproved(u.pivot.approved)).length;
                    const pendingMembers = group.users.filter(u => !isPivotApproved(u.pivot.approved)).length;
                    const isUserInGroup = group.users.some(u => u.id === auth.user.id);
                    const isUserApproved = isPivotApproved(
                        group.users.find(u => u.id === auth.user.id)?.pivot.approved,
                    );

                    return (
                        <Grid size={{xs: 12}} key={group.id}>
                            <GlassPaper sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                p: 0, // Override default padding for Card layout
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : theme.palette.background.paper,
                                    borderColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.2)' 
                                        : theme.palette.primary.main,
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.palette.mode === 'dark' 
                                        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                                        : `0 8px 32px ${theme.palette.primary.main}20`,
                                }
                            }}>
                                {/* Group Banner */}
                                <Box sx={{ height: 120, overflow: 'hidden' }}>
                                    <GroupBanner group={group} height={120} />
                                </Box>
                                
                                <CardContent sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <GroupAvatar group={group} size={40} sx={{ mr: 2 }} />
                                        <Typography variant="h6" component="h2">
                                            {group.name}
                                        </Typography>
                                    </Box>
                                    {group.description && (
                                        <Tooltip title={group.description}>
                                        <Typography color="text.secondary" sx={{ mb: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {group.description}
                                        </Typography>
                                        </Tooltip>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                        <Chip
                                            icon={<PersonIcon />}
                                            label={t('groups.approvedMembers', { count: approvedMembers })}
                                            color="primary"
                                            size="small"
                                        />
                                    </Box>
                                    {pendingMembers > 0 && isUserApproved && (
                                        <Chip
                                            label={t('groups.pendingRequests', { count: pendingMembers })}
                                            color="warning"
                                            size="small"
                                        />
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button
                                        component={Link}
                                        href={route('groups.show', group.id)}
                                        size="small"
                                    >
                                        {t('common.viewDetails')}
                                    </Button>
                                    {isUserApproved && (
                                        <>
                                            <IconButton
                                                component={Link}
                                                href={route('groups.edit', group.id)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                href={route('groups.destroy', group.id)}
                                                method="delete"
                                                as="button"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                    {!isUserInGroup && (
                                        <Button
                                            onClick={() => handleJoinGroup(group.id)}
                                            disabled={processing}
                                            variant="outlined"
                                            size="small"
                                        >
                                            {t('groups.joinGroup')}
                                        </Button>
                                    )}
                                    {isUserInGroup && !isUserApproved && (
                                        <Chip
                                            label={t('common.pendingApproval')}
                                            color="warning"
                                            size="small"
                                        />
                                    )}
                                </CardActions>
                            </GlassPaper>
                        </Grid>
                    );
                })}
            </Grid>
                </Box>
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={groups.last_page}
                    page={groups.current_page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </AuthenticatedLayout>
    );
}
