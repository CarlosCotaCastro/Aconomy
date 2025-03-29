import { Link, useForm } from '@inertiajs/react';
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
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    RequestQuote as RequestQuoteIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ item, auth }) {
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
                    Back to Groups
                </Button>

                <Typography variant="h4" component="h1" gutterBottom>
                    Request to Borrow
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                                    <DescriptionIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Item Details
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
                                        Owner
                                    </Typography>
                                    <Typography variant="body1">
                                        {item.user.name}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                                    <RequestQuoteIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Your Request
                                </Typography>
                            </Box>
                            
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Message (Optional)"
                                    variant="outlined"
                                    placeholder="Let the owner know why you'd like to borrow this item..."
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    error={!!errors.message}
                                    helperText={errors.message}
                                    sx={{ mb: 3 }}
                                />
                                
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    Your request will be sent to {item.user.name}. They'll need to approve your request before you can borrow this item.
                                </Alert>
                                
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={processing}
                                    fullWidth
                                    size="large"
                                >
                                    Send Borrow Request
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
} 