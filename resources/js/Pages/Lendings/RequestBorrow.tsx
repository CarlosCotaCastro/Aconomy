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
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { lightTokens } from '@/lightTheme';

export default function RequestBorrow({ item, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });
    const theme = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('lendings.borrow.store', item.id));
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={
                <Typography variant="h4" component="h1" sx={{ 
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                }}>
                    Request to Borrow Item
                </Typography>
            }
        >
            <Box sx={{ py: 3 }}>
                <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ mb: 4 }}>
                        <Button
                            component={Link}
                            href={route('groups.items.index', item.group_id)}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                mb: 3,
                                color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(255, 138, 76, 0.08)',
                                }
                            }}
                        >
                            Back to Group Items
                        </Button>

                        <Typography variant="h4" component="h1" gutterBottom sx={{ 
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                        }}>
                            Request to Borrow Item
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid md={6}>
                            <Card sx={{
                                background: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.02)'
                                    : lightTokens.surface,
                                backdropFilter: 'blur(10px)',
                                border: theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : `1px solid ${lightTokens.border}`,
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    : lightTokens.shadow,
                                ...(theme.palette.mode !== 'dark' && { borderRadius: '28px' }),
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                        Item Details
                                    </Typography>
                                    
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                                            {item.name}
                                        </Typography>
                                        {item.description && (
                                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                                                {item.description}
                                            </Typography>
                                        )}
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ 
                                            mr: 2,
                                            bgcolor: theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'primary.main'
                                        }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Owner
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {item.user.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid md={6}>
                            <Card sx={{
                                background: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.02)'
                                    : lightTokens.surface,
                                backdropFilter: 'blur(10px)',
                                border: theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : `1px solid ${lightTokens.border}`,
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    : lightTokens.shadow,
                                ...(theme.palette.mode !== 'dark' && { borderRadius: '28px' }),
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: theme.palette.mode === 'dark' 
                                                            ? 'rgba(255, 255, 255, 0.3)'
                                                            : lightTokens.border,
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: theme.palette.mode === 'dark' 
                                                            ? 'rgba(255, 255, 255, 0.5)'
                                                            : lightTokens.text,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'primary.main',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: theme.palette.mode === 'dark' 
                                                        ? 'rgba(255, 255, 255, 0.7)'
                                                        : lightTokens.muted,
                                                },
                                            }}
                                        />
                                        
                                        <Alert 
                                            severity="info" 
                                            sx={{ 
                                                mt: 2, 
                                                mb: 3,
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? 'rgba(2, 136, 209, 0.1)'
                                                    : 'rgba(91, 108, 255, 0.1)',
                                                color: theme.palette.mode === 'dark'
                                                    ? 'rgb(166, 213, 250)'
                                                    : lightTokens.indigo,
                                                '& .MuiAlert-icon': {
                                                    color: theme.palette.mode === 'dark'
                                                        ? 'rgb(166, 213, 250)'
                                                        : lightTokens.indigo,
                                                },
                                            }}
                                        >
                                            By requesting to borrow this item, you agree to take good care of it and return it in the same condition.
                                        </Alert>
                                        
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={processing}
                                            fullWidth
                                            sx={{ 
                                                fontWeight: 500,
                                                py: 1.5,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            Send Borrow Request
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
} 