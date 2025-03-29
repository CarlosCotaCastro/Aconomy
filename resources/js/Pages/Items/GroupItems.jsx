import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    CardMedia,
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function GroupItems({ group, items, auth }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {group.name} - Available Items
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {filteredItems.map((item) => (
                    <Grid md={4} sm={6} key={item.id}>
                        <Card>
                            {item.image_path ? (
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={`/storage/${item.image_path}`}
                                    alt={item.name}
                                    sx={{ objectFit: 'contain', padding: 1 }}
                                />
                            ) : (
                                <Box 
                                    sx={{ 
                                        height: 120, 
                                        bgcolor: 'rgba(0,0,0,0.05)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        No Image
                                    </Typography>
                                </Box>
                            )}
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {item.name}
                                </Typography>
                                {item.description && (
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {item.description}
                                    </Typography>
                                )}
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon fontSize="small" />
                                    <Typography variant="body2">
                                        Owner: {item.user.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    <Chip
                                        label={item.is_available ? "Available" : "Currently Borrowed"}
                                        color={item.is_available ? "success" : "error"}
                                        size="small"
                                    />
                                </Box>
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
        </AuthenticatedLayout>
    );
} 