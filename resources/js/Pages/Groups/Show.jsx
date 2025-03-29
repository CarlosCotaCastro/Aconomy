import { Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Paper,
    Grid,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Group as GroupIcon,
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Inventory as InventoryIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import debounce from 'lodash/debounce';

export default function Show({ group, auth }) {
    const { post, processing } = useForm();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const approvedMembers = group.users.filter(user => user.pivot.approved);
    const pendingMembers = group.users.filter(user => !user.pivot.approved);
    const isUserApproved = group.users.find(u => u.id === auth.user.id)?.pivot.approved;

    const handleApproveUser = (userId) => {
        post(route('groups.approve', [group.id, userId]));
    };
    
    // Create a debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            setIsSearching(true);
            try {
                console.log(`Searching with query: "${query}"`);
                const response = await axios.get(route('groups.search-items', group.id), {
                    params: { query },
                });
                console.log('Search response:', response.data);
                setSearchResults(response.data);
                setShowSearchResults(true);  // Always show results section after a search
            } catch (error) {
                console.error('Search error:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                }
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        [group.id]
    );
    
    // Effect to trigger search when query changes
    useEffect(() => {
        if (isUserApproved) {
            if (searchQuery.trim()) {
                debouncedSearch(searchQuery);
            } else {
                // If search is empty, load all items
                loadInitialItems();
            }
        }
    }, [searchQuery, isUserApproved, debouncedSearch]);
    
    // Load initial items when component mounts
    const loadInitialItems = useCallback(async () => {
        if (!isUserApproved) return;
        
        setIsSearching(true);
        try {
            console.log('Loading initial items');
            const response = await axios.get(route('groups.search-items', group.id));
            console.log('Initial items:', response.data);
            setSearchResults(response.data);
            setShowSearchResults(response.data.length > 0);
        } catch (error) {
            console.error('Error loading items:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [group.id, isUserApproved]);
    
    // Load initial items when component mounts
    useEffect(() => {
        loadInitialItems();
    }, [loadInitialItems]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ mb: 4 }}>
                <Button
                    component={Link}
                    href={route('groups.index')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Back to Groups
                </Button>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                            <GroupIcon />
                        </Avatar>
                        <Typography variant="h4" component="h1">
                            {group.name}
                        </Typography>
                    </Box>
                </Box>

                {group.description && (
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        {group.description}
                    </Typography>
                )}
            </Box>
            
            {/* Search Component */}
            {isUserApproved && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'secondary.light', mr: 3 }}>
                                <InventoryIcon />
                            </Avatar>
                            <Typography variant="h6">
                                Shared Items
                            </Typography>
                        </Box>
                        
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search items in this group..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: isSearching && (
                                    <InputAdornment position="end">
                                        <CircularProgress size={24} />
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                        {showSearchResults && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {searchResults.length} items found
                                </Typography>
                                
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    {searchResults.map((item) => (
                                        <Grid md={4} sm={6} key={item.id}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6" component="h3" gutterBottom>
                                                        {item.name}
                                                    </Typography>
                                                    
                                                    {item.description && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {item.description}
                                                        </Typography>
                                                    )}
                                                    
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                                        <Typography variant="body2">
                                                            {item.user.name}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Chip
                                                        label={item.is_available ? "Available" : "Currently Borrowed"}
                                                        color={item.is_available ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </CardContent>
                                                
                                                <CardActions>
                                                    {item.is_available && item.user_id !== auth.user.id && (
                                                        <Button
                                                            component={Link}
                                                            href={route('borrow-requests.create', { item: item.id })}
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                        >
                                                            Request to Borrow
                                                        </Button>
                                                    )}
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                                
                                {searchResults.length === 0 && !isSearching && (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">
                                            No items found. Try a different search term or add some items to the group.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            <Grid container spacing={3}>
                <Grid md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Members ({approvedMembers.length})
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List>
                                {approvedMembers.map(user => (
                                    <ListItem key={user.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={user.email}
                                        />
                                    </ListItem>
                                ))}
                                {approvedMembers.length === 0 && (
                                    <Typography color="text.secondary">
                                        No members in this group yet.
                                    </Typography>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {isUserApproved && pendingMembers.length > 0 && (
                    <Grid md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Pending Requests ({pendingMembers.length})
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <List>
                                    {pendingMembers.map(user => (
                                        <ListItem 
                                            key={user.id}
                                            secondaryAction={
                                                <Box>
                                                    <IconButton 
                                                        edge="end" 
                                                        color="success"
                                                        onClick={() => handleApproveUser(user.id)}
                                                        disabled={processing}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.name}
                                                secondary={user.email}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {group.users.find(u => u.id === auth.user.id) ? (
                <Box sx={{ mt: 3 }}>
                    <Button
                        component={Link}
                        href={route('groups.leave', group.id)}
                        method="delete"
                        as="button"
                        variant="outlined"
                        color="error"
                    >
                        Leave Group
                    </Button>
                </Box>
            ) : (
                <Box sx={{ mt: 3 }}>
                    <Button
                        component={Link}
                        href={route('groups.join', group.id)}
                        method="post"
                        as="button"
                        variant="contained"
                    >
                        Join Group
                    </Button>
                </Box>
            )}
        </AuthenticatedLayout>
    );
} 