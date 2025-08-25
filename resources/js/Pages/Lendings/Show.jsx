import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Box, Button, Card, CardContent, Typography, Grid, Chip, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, useTheme } from '@mui/material';
import { useState } from 'react';

export default function Show({ auth, lending }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [notes, setNotes] = useState('');
    const theme = useTheme();

    const { post, processing } = useForm();

    const handleReturn = () => {
        post(route('lendings.return', lending.id));
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNotes('');
    };

    const handleSubmitRequest = () => {
        post(route('return-requests.store', lending.id), {
            notes: notes,
            onSuccess: () => {
                handleCloseDialog();
            }
        });
    };

    const hasActiveReturnRequest = lending.active_return_request !== null;

    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    const renderUserInfo = (user) => {
        const isCurrentUser = user.id === auth.user.id;
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {!isCurrentUser && (
                    user.profile_image_path ? (
                        <Avatar
                            src={`/storage/${user.profile_image_path}`}
                            alt={user.name}
                            sx={{ width: 32, height: 32 }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: stringToColor(user.name),
                                fontSize: '1rem'
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                    )
                )}
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        {isCurrentUser ? 'me' : user.name}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={
                <Typography variant="h4" component="h1" sx={{ 
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                }}>
                    Lending Details
                </Typography>
            }
        >
            <Box sx={{ py: 3 }}>
                <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                        }}>
                            Lending Details
                        </Typography>
                        <Button 
                            component={Link}
                            href={route('lendings.index')}
                            variant="outlined"
                            sx={{
                                borderColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.3)'
                                    : 'primary.main',
                                color: theme.palette.mode === 'dark' 
                                    ? 'white'
                                    : 'primary.main',
                                '&:hover': {
                                    borderColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.5)'
                                        : 'primary.dark',
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(25, 118, 210, 0.04)',
                                }
                            }}
                        >
                            Back to Lendings
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid md={6}>
                            <Card sx={{
                                background: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.02)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                        Item Information
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Name
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {lending.item.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Description
                                        </Typography>
                                        <Typography variant="body1">
                                            {lending.item.description || 'No description provided'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Chip 
                                            label={lending.returned_at ? "Returned" : "Active Lending"} 
                                            color={lending.returned_at ? "success" : "primary"} 
                                            sx={{
                                                fontWeight: 500,
                                                '& .MuiChip-label': {
                                                    px: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid md={6}>
                            <Card sx={{
                                background: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.02)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                        Lending Information
                                    </Typography>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Lender
                                        </Typography>
                                        {renderUserInfo(lending.lender)}
                                    </Box>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Borrower
                                        </Typography>
                                        {renderUserInfo(lending.borrower)}
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Lent Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(lending.lent_at).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    {lending.returned_at && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Returned Date
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(lending.returned_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {!lending.returned_at && auth.user.id === lending.lender.id && (
                                        <Box sx={{ mt: 3 }}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={handleReturn}
                                                disabled={processing}
                                                sx={{ fontWeight: 500 }}
                                            >
                                                Mark as Returned
                                            </Button>
                                        </Box>
                                    )}
                                    
                                    {!lending.returned_at && auth.user.id === lending.borrower.id && (
                                        <Box sx={{ mt: 3 }}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={handleOpenDialog}
                                                disabled={processing || hasActiveReturnRequest}
                                                sx={{ fontWeight: 500 }}
                                            >
                                                {hasActiveReturnRequest ? "Return Request Pending" : "Request to Return Item"}
                                            </Button>
                                        </Box>
                                    )}
                                    
                                    {hasActiveReturnRequest && (
                                        <Box sx={{ mt: 3 }}>
                                            <Chip 
                                                label="Return Request Pending" 
                                                color="warning" 
                                                sx={{
                                                    fontWeight: 500,
                                                    '& .MuiChip-label': {
                                                        px: 2
                                                    }
                                                }}
                                            />
                                            {lending.active_return_request && lending.active_return_request.notes && auth.user.id === lending.lender.id && (
                                                <Box sx={{ 
                                                    mt: 2, 
                                                    p: 2, 
                                                    bgcolor: theme.palette.mode === 'dark'
                                                        ? 'rgba(255, 152, 0, 0.1)'
                                                        : 'rgba(255, 244, 229, 0.7)', 
                                                    borderRadius: 2,
                                                    border: theme.palette.mode === 'dark'
                                                        ? '1px solid rgba(255, 152, 0, 0.2)'
                                                        : '1px solid rgba(255, 152, 0, 0.3)'
                                                }}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                                        Message from borrower:
                                                    </Typography>
                                                    <Typography variant="body2" fontStyle="italic" sx={{ color: 'text.secondary' }}>
                                                        "{lending.active_return_request.notes}"
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                
                    <Dialog 
                        open={openDialog} 
                        onClose={handleCloseDialog}
                        PaperProps={{
                            sx: {
                                background: theme.palette.mode === 'dark' 
                                    ? 'rgba(18, 18, 18, 0.95)'
                                    : 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: 2,
                            }
                        }}
                    >
                        <DialogTitle sx={{ fontWeight: 600 }}>
                            Request to Return Item
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ mb: 2 }}>
                                Request to return this item to the lender. They will receive an email notification and will need to approve the return.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="notes"
                                label="Notes (optional)"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                multiline
                                rows={3}
                                placeholder="Add any details about the return (condition, location for return, etc.)"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.3)'
                                                : 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.5)'
                                                : 'rgba(0, 0, 0, 0.87)',
                                        },
                                    },
                                }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 1 }}>
                            <Button 
                                onClick={handleCloseDialog}
                                variant="outlined"
                                sx={{
                                    borderColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.3)'
                                        : 'rgba(0, 0, 0, 0.23)',
                                    color: theme.palette.mode === 'dark' 
                                        ? 'white'
                                        : 'text.primary',
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSubmitRequest} 
                                disabled={processing}
                                variant="contained"
                                sx={{ fontWeight: 500 }}
                            >
                                Submit Request
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
} 