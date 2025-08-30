import { Link } from '@inertiajs/react';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    IconButton, 
    TextField, 
    InputAdornment,
    useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon, 
    Search as SearchIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import { useTranslation } from 'react-i18next';
import GlassPaper from '@/Components/GlassPaper';

export default function Index({ items, auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? $items;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {t('items.myItems')}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <GlassPaper
                        sx={{
                            borderRadius: 2,
                            boxShadow: theme.palette.mode === 'dark' 
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                                : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                            <Grid container sx={{justifyContent: 'space-between', mb: 4 }}>
                                <Grid item size={{xs: 12, md: 6, lg: 8}}>   
                                <Typography variant="h5" component="h1">
                                    {t('items.myItems')}
                                </Typography>
                                </Grid>
                                <Grid item size={{xs: 12, md: 6, lg: 4}}>
                                <PrimaryButton
                                    component={Link}
                                    href={route('items.create')}
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                >
                                    {t('items.addNewItem')}
                                </PrimaryButton>
                                </Grid>
                            </Grid>

                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    type="search"
                                    variant="outlined"
                                    placeholder={t('items.searchMyItems')}
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
                                        <GlassPaper 
                                            sx={{ 
                                                height: '100%', 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                p: 0, // Override default padding for Card layout
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
                                                    height="200"
                                                    image={`/storage/${item.image_path}`}
                                                    alt={item.name}
                                                    sx={{
                                                        objectFit: 'cover',
                                                        padding: 0,
                                                        aspectRatio: 16 / 9
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        height: 140,
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
                                                    {t('common.edit')}
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    href={route('items.show', item.id)}
                                                    size="small"
                                                >
                                                    {t('common.viewDetails')}
                                                </Button>
                                                <IconButton
                                                    component={Link}
                                                    href={route('items.destroy', item.id)}
                                                    method="delete"
                                                    as="button"
                                                    size="small"
                                                    title={t('common.delete')}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </CardActions>
                                        </GlassPaper>
                                    </Grid>
                                ))}
                            </Grid>
                    </GlassPaper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
