import {
    Avatar,
    Box, Button,
    Card, CardActions,
    CardContent, Chip,
    CircularProgress,
    Grid,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {Inventory as InventoryIcon, Person as PersonIcon, Search as SearchIcon} from "@mui/icons-material";
import {Link} from "@inertiajs/react";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';

export default ({group, userId, isUserApproved}) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

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

    return (<Card sx={{ 
        mb: 4,
        background: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(255, 255, 255, 1)',
        backdropFilter: 'blur(10px)',
        border: (theme) => theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
    }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(187, 134, 252, 0.2)'
                        : 'secondary.light',
                    mr: 3,
                    border: (theme) => theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : 'none',
                }}>
                    <InventoryIcon />
                </Avatar>
                <Typography variant="h6">
                    {t('groups.sharedItems')}
                </Typography>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder={t('groups.searchItemsPlaceholder')}
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
                        {t('groups.itemsFound', { count: searchResults.length })}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {searchResults.map((item) => (
                            <Grid key={item.id} size={12}>
                                <Card variant="outlined" sx={{
                                    background: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.02)'
                                        : 'rgba(255, 255, 255, 1)',
                                    backdropFilter: 'blur(10px)',
                                    border: (theme) => theme.palette.mode === 'dark' 
                                        ? '1px solid rgba(255, 255, 255, 0.1)'
                                        : '1px solid rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: (theme) => theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.05)'
                                            : 'rgba(255, 255, 255, 1)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: (theme) => theme.palette.mode === 'dark'
                                            ? '0 8px 32px rgba(187, 134, 252, 0.1)'
                                            : '0 8px 32px rgba(0, 0, 0, 0.1)',
                                    }
                                }}>
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
                                            label={item.is_available ? t('items.available') : t('items.currentlyBorrowed')}
                                            color={item.is_available ? "success" : "error"}
                                            size="small"
                                        />
                                    </CardContent>

                                    <CardActions>
                                        {item.is_available && item.user_id !== userId && (
                                            <Button
                                                component={Link}
                                                href={route('borrow-requests.create', { item: item.id })}
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                            >
                                                {t('items.requestToBorrow')}
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
                                {t('groups.noItemsFound')}
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}
        </CardContent>
    </Card>
    );
}
