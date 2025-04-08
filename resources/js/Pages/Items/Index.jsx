import { Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Grid,
    Typography,
    IconButton, TextField, InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon, Search as SearchIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useState} from "react";

export default function Index({ items, auth }) {

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? $items;

    return (
        <AuthenticatedLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    My Items
                </Typography>
                <Button
                    component={Link}
                    href={route('items.create')}
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Add Item
                </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search my items..."
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
                    <Grid size={{xs: 12, sm: 6, md: 4, xl: 2}} key={item.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {item.image_path ? (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`/storage/${item.image_path}`}
                                    alt={item.name}
                                    sx={{ objectFit: 'contain', padding: 1 }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: 140,
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
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h2">
                                    {item.name}
                                </Typography>
                                {item.description && (
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {item.description}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <Button
                                    component={Link}
                                    href={route('items.edit', item.id)}
                                    size="small"
                                >
                                    Edit
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('items.show', item.id)}
                                    size="small"
                                >
                                    View Details
                                </Button>
                                <IconButton
                                    component={Link}
                                    href={route('items.destroy', item.id)}
                                    method="delete"
                                    as="button"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </AuthenticatedLayout>
    );
}
