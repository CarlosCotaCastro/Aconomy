import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    Paper,
    Grid,
    Avatar,
    Alert,
    Stack,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RequestBorrow({ item, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('lendings.borrow.store', item.id));
    };

    return (
        <AuthenticatedLayout>
            <Box sx={{ mb: 4 }}>
                <Button
                    component={Link}
                    href={route('groups.items.index', item.group_id)}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Back to Group Items
                </Button>

                <Typography variant="h4" component="h1" gutterBottom>
                    Request to Borrow Item
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Item Details
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                {item.description && (
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {item.description}
                                    </Typography>
                                )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                
                <Grid md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Send Borrow Request
                            </Typography>
                            
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Message to Owner (Optional)"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    margin="normal"
                                    error={!!errors.message}
                                    helperText={errors.message}
                                    placeholder="Let the owner know why you'd like to borrow this item..."
                                />
                                
                                <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
                                    By requesting to borrow this item, you agree to take good care of it and return it in the same condition.
                                </Alert>
                                
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={processing}
                                    fullWidth
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