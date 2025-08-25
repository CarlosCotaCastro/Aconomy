import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    TextField,
    Grid,
    Avatar,
    Alert,
    Divider,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    RequestQuote as RequestQuoteIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ item, auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { data, setData, post, processing, errors } = useForm({
        item_id: item.id,
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('borrow-requests.store'));
    };

    return (
        <AuthenticatedLayout>
            <Box sx={{ mb: 4 }}>
                <Button
                    component={Link}
                    href={route('groups.index')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    {t('groups.backToGroups')}
                </Button>

                <Typography variant="h4" component="h1" gutterBottom>
                    {t('borrowRequests.requestToBorrow')}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid md={6}>
                    <Card
                        sx={{
                            background: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.02)' 
                                : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: theme.palette.mode === 'dark' 
                                ? '1px solid rgba(255, 255, 255, 0.1)' 
                                : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                                    <DescriptionIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    {t('borrowRequests.itemDetails')}
                                </Typography>
                            </Box>
                            
                            <Typography variant="h5" component="div" gutterBottom>
                                {item.name}
                            </Typography>
                            
                            {item.description && (
                                <Typography color="text.secondary" paragraph>
                                    {item.description}
                                </Typography>
                            )}
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('items.owner')}
                                    </Typography>
                                    <Typography variant="body1">
                                        {item.user.name}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid md={6}>
                    <Card
                        sx={{
                            background: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.02)' 
                                : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: theme.palette.mode === 'dark' 
                                ? '1px solid rgba(255, 255, 255, 0.1)' 
                                : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                                    <RequestQuoteIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    {t('borrowRequests.yourRequest')}
                                </Typography>
                            </Box>
                            
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label={t('borrowRequests.messageLabel')}
                                    variant="outlined"
                                    placeholder={t('borrowRequests.messagePlaceholder')}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    error={!!errors.message}
                                    helperText={errors.message}
                                    sx={{ mb: 3 }}
                                />
                                
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    {t('borrowRequests.requestInfo', { name: item.user.name })}
                                </Alert>
                                
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={processing}
                                    fullWidth
                                    size="large"
                                >
                                    {t('borrowRequests.sendRequest')}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
} 