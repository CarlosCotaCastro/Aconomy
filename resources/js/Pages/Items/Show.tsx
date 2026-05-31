import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Divider,
    Chip,
    useTheme,
} from '@mui/material';
import GlassPaper from '@/Components/GlassPaper';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { lightTokens } from '@/lightTheme';

export default function Show({ item, auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isOwner = auth.user.id === item.user_id;

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Box
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.02)'
                                : lightTokens.surface,
                            backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'blur(10px)',
                            border: theme.palette.mode === 'dark'
                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                : `1px solid ${lightTokens.border}`,
                            borderRadius: theme.palette.mode === 'dark' ? 2 : '28px',
                            p: 3,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                                : lightTokens.shadow,
                        }}
                    >
                        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                            <Button
                                component={Link}
                                href={route('items.index')}
                                startIcon={<ArrowBackIcon />}
                                sx={{ mb: 3 }}
                            >
                                {t('items.backToItems')}
                            </Button>

                            <Card
                                sx={{
                                    mb: 4,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.02)'
                                        : lightTokens.surfaceSolid,
                                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'blur(10px)',
                                    border: theme.palette.mode === 'dark'
                                        ? '1px solid rgba(255, 255, 255, 0.1)'
                                        : `1px solid ${lightTokens.border}`,
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                                        : lightTokens.shadow,
                                }}
                            >
                                <Grid container>
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        {item.image_path ? (
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={`/storage/${item.image_path}`}
                                                alt={item.name}
                                                sx={{
                                                    objectFit: 'cover', p: 0,

                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 300,
                                                    bgcolor: theme.palette.mode === 'dark'
                                                        ? 'rgba(255, 255, 255, 0.05)'
                                                        : 'rgba(239, 231, 220, 0.55)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    aspectRatio: '16/9'
                                                }}
                                            >
                                                <Typography color="text.secondary">
                                                    {t('items.noImage')}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Typography variant="h4" component="h1">
                                                    {item.name}
                                                </Typography>
                                                {isOwner && (
                                                    <Button
                                                        component={Link}
                                                        href={route('items.edit', item.id)}
                                                        startIcon={<EditIcon />}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        {t('common.edit')}
                                                    </Button>
                                                )}
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {item.description && (
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {item.description}
                                                </Typography>
                                            )}

                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                                <PersonIcon color="primary" sx={{ mr: 1 }} />
                                                <Typography variant="body2">
                                                    {isOwner ? t('items.youOwnThisItem') : t('items.owner', { name: item.user?.name })}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mt: 2 }}>
                                                <Chip
                                                    color={item.isAvailable ? "success" : "error"}
                                                    label={item.isAvailable ? t('items.available') : t('items.currentlyBorrowed')}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </Card>

                            {item.lendings && (
                                <GlassPaper>
                                    <Typography variant="h6" gutterBottom>
                                        {t('items.lendingHistory')}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    {item.lendings.length > 0 && item.lendings.map((lending) => (
                                        <Box
                                            key={lending.id}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                bgcolor: theme.palette.mode === 'dark'
                                                    ? 'rgba(255, 255, 255, 0.03)'
                                                    : 'background.default',
                                                borderRadius: 1,
                                                border: theme.palette.mode === 'dark'
                                                    ? '1px solid rgba(255, 255, 255, 0.08)'
                                                    : `1px solid ${lightTokens.border}`,
                                            }}
                                        >
                                            <Typography variant="subtitle1">
                                                {t('items.borrowedBy', { name: lending.borrower.name })}
                                            </Typography>
                                            <Typography variant="body2">
                                                {t('items.lentFrom', { date: new Date(lending.lent_at).toLocaleDateString() })}
                                            </Typography>
                                            {lending.returned_at ? (
                                                <Typography variant="body2">
                                                    {t('items.returnedAt', { date: new Date(lending.returned_at).toLocaleDateString() })}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="error">
                                                    {t('items.notYetReturned')}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                    {item.lendings.length === 0 && (
                                        <Typography variant="body2">
                                            {t('items.noLendings')}
                                        </Typography>
                                    )}
                                </GlassPaper>
                            )}
                        </Box>
                    </Box>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 