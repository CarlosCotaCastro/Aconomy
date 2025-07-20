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
    Paper,
    Divider,
    Chip,
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ item, auth }) {
    const { t } = useTranslation();
    const isOwner = auth.user.id === item.user_id;
    
    return (
        <AuthenticatedLayout>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Button
                    component={Link}
                    href={route('items.index')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 3 }}
                >
                    {t('items.backToItems')}
                </Button>
                
                <Card sx={{ mb: 4 }}>
                    <Grid container>
                        <Grid size={{xs: 12, md: 8}}>
                            {item.image_path ? (
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={`/storage/${item.image_path}`}
                                    alt={item.name}
                                    sx={{ objectFit: 'cover', p: 0 ,
                                        
                                     }}
                                />
                            ) : (
                                <Box 
                                    sx={{ 
                                        height: 300, 
                                        bgcolor: 'rgba(0,0,0,0.05)', 
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
                        <Grid size={{xs: 12, md: 4}}>
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
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('items.lendingHistory')}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {item.lendings.length > 0 && item.lendings.map((lending) => (
                            <Box key={lending.id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
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
                    </Paper>
                )}
            </Box>
        </AuthenticatedLayout>
    );
} 