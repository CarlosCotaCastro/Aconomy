import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
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
    useTheme,
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function GroupItems({ group, items, auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Box
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.02)' 
                                : 'rgba(255, 255, 255, 1)',
                            backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                            border: theme.palette.mode === 'dark' 
                                ? '1px solid rgba(255, 255, 255, 0.1)' 
                                : '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: theme.palette.mode === 'dark' 
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                                : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('items.groupItemsTitle', { groupName: group.name })}
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={t('items.searchItemsPlaceholder')}
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
                        <Card
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.02)' 
                                    : 'rgba(255, 255, 255, 1)',
                                backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                                border: theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                                    : '1px solid rgba(0, 0, 0, 0.1)',
                                boxShadow: theme.palette.mode === 'dark' 
                                    ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
                                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: theme.palette.mode === 'dark' 
                                        ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                                        : '0 4px 8px rgba(0, 0, 0, 0.15)',
                                }
                            }}
                        >
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
                                        bgcolor: theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.05)' 
                                            : 'rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        {t('items.noImage')}
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
                                        {t('items.owner', { name: item.user.name })}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    <Chip
                                        label={item.is_available ? t('items.available') : t('items.currentlyBorrowed')}
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
                                        {t('items.requestToBorrow')}
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                        </Grid>
                    </Box>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
