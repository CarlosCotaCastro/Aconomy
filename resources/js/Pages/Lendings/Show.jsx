import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Box, Button, Card, CardContent, Typography, Grid, Chip, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar } from '@mui/material';
import { useState } from 'react';

export default function Show({ auth, lending }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [notes, setNotes] = useState('');

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
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Lending Details</Typography>
                    <Button 
                        component={Link}
                        href={route('lendings.index')}
                        variant="outlined"
                    >
                        Back to Lendings
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Item Information</Typography>
                                <Typography variant="body1"><strong>Name:</strong> {lending.item.name}</Typography>
                                <Typography variant="body1"><strong>Description:</strong> {lending.item.description}</Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chip 
                                        label={lending.returned_at ? "Returned" : "Active Lending"} 
                                        color={lending.returned_at ? "success" : "primary"} 
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Lending Information</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Lender
                                    </Typography>
                                    {renderUserInfo(lending.lender)}
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Borrower
                                    </Typography>
                                    {renderUserInfo(lending.borrower)}
                                </Box>
                                <Typography variant="body1"><strong>Lent Date:</strong> {new Date(lending.lent_at).toLocaleDateString()}</Typography>
                                {lending.returned_at && (
                                    <Typography variant="body1"><strong>Returned Date:</strong> {new Date(lending.returned_at).toLocaleDateString()}</Typography>
                                )}
                                
                                {!lending.returned_at && auth.user.id === lending.lender.id && (
                                    <Box sx={{ mt: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={handleReturn}
                                            disabled={processing}
                                        >
                                            Mark as Returned
                                        </Button>
                                    </Box>
                                )}
                                
                                {!lending.returned_at && auth.user.id === lending.borrower.id && (
                                    <Box sx={{ mt: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={handleOpenDialog}
                                            disabled={processing || hasActiveReturnRequest}
                                        >
                                            {hasActiveReturnRequest ? "Return Request Pending" : "Request to Return Item"}
                                        </Button>
                                    </Box>
                                )}
                                
                                {hasActiveReturnRequest && (
                                    <Box sx={{ mt: 2 }}>
                                        <Chip 
                                            label="Return Request Pending" 
                                            color="warning" 
                                        />
                                        {lending.active_return_request && lending.active_return_request.notes && auth.user.id === lending.lender.id && (
                                            <Box sx={{ mt: 1, p: 2, bgcolor: 'rgba(255, 244, 229, 0.7)', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Message from borrower:
                                                </Typography>
                                                <Typography variant="body2" fontStyle="italic">
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
                
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Request to Return Item</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
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
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmitRequest} disabled={processing}>Submit Request</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AuthenticatedLayout>
    );
} 