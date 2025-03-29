import { useState } from 'react';
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
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Paper,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    QrCode2 as QrCodeIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ borrowRequest, qrCode, codeExpiresAt, auth }) {
    const [openQrDialog, setOpenQrDialog] = useState(false);
    const [openDenyDialog, setOpenDenyDialog] = useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
    
    const { data: approveData, post: approvePost, processing: approveProcessing } = useForm({});
    const { data: denyData, setData: setDenyData, post: denyPost, processing: denyProcessing } = useForm({
        reason: '',
    });
    const { data: verifyData, setData: setVerifyData, post: verifyPost, processing: verifyProcessing } = useForm({
        code: '',
    });
    
    const handleApprove = () => {
        approvePost(route('borrow-requests.approve', borrowRequest.id));
    };
    
    const handleDeny = () => {
        denyPost(route('borrow-requests.deny', borrowRequest.id));
        setOpenDenyDialog(false);
    };
    
    const handleVerifyCode = () => {
        verifyPost(route('borrow-requests.verify-code', borrowRequest.id));
        setOpenVerifyDialog(false);
    };

    // Helper function to get status chip
    const getStatusChip = () => {
        switch(borrowRequest.status) {
            case 'pending':
                return <Chip icon={<ScheduleIcon />} label="Pending" color="warning" />;
            case 'approved':
                return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" />;
            case 'denied':
                return <Chip icon={<CancelIcon />} label="Denied" color="error" />;
            case 'completed':
                return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" />;
            default:
                return <Chip label={borrowRequest.status} />;
        }
    };
    
    const isLender = auth.user.id === borrowRequest.lender_id;
    const isBorrower = auth.user.id === borrowRequest.borrower_id;

    return (
        <AuthenticatedLayout>
            <Box sx={{ mb: 4 }}>
                <Button
                    component={Link}
                    href={route('borrow-requests.index')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Back to Requests
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        Borrow Request Details
                    </Typography>
                    {getStatusChip()}
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Item Details
                            </Typography>
                            
                            <Typography variant="h5" component="div">
                                {borrowRequest.item.name}
                            </Typography>
                            
                            {borrowRequest.item.description && (
                                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                                    {borrowRequest.item.description}
                                </Typography>
                            )}
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2 }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Owner
                                            </Typography>
                                            <Typography variant="body1">
                                                {borrowRequest.lender.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2 }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Borrower
                                            </Typography>
                                            <Typography variant="body1">
                                                {borrowRequest.borrower.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            
                            {borrowRequest.message && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Message from borrower:
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                                        <Typography variant="body2" fontStyle="italic">
                                            "{borrowRequest.message}"
                                        </Typography>
                                    </Paper>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Request Status
                            </Typography>
                            
                            {borrowRequest.status === 'pending' && isLender && (
                                <Box sx={{ mt: 2 }}>
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        {borrowRequest.borrower.name} would like to borrow your {borrowRequest.item.name}. 
                                        Please approve or deny this request.
                                    </Alert>
                                    
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleApprove}
                                            disabled={approveProcessing}
                                            startIcon={<CheckCircleIcon />}
                                            fullWidth
                                        >
                                            Approve Request
                                        </Button>
                                        
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => setOpenDenyDialog(true)}
                                            disabled={approveProcessing}
                                            startIcon={<CancelIcon />}
                                            fullWidth
                                        >
                                            Deny Request
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                            
                            {borrowRequest.status === 'pending' && isBorrower && (
                                <Alert severity="info">
                                    Your request is pending. {borrowRequest.lender.name} will review your request soon.
                                </Alert>
                            )}
                            
                            {borrowRequest.status === 'approved' && (
                                <Box>
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        This borrow request has been approved! The next step is to arrange the handover.
                                    </Alert>
                                    
                                    {isLender && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                QR Code for Item Handover
                                            </Typography>
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                When you meet with the borrower, show them this QR code.
                                                They will scan it to confirm receipt of the item.
                                            </Typography>
                                            
                                            {codeExpiresAt && (
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                                                    Code expires {codeExpiresAt}
                                                </Typography>
                                            )}
                                            
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<QrCodeIcon />}
                                                onClick={() => setOpenQrDialog(true)}
                                            >
                                                Show QR Code
                                            </Button>
                                        </Box>
                                    )}
                                    
                                    {isBorrower && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Verify Item Handover
                                            </Typography>
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                When you meet with the owner, they will show you a QR code.
                                                Scan it or enter the code manually to confirm receipt of the item.
                                            </Typography>
                                            
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setOpenVerifyDialog(true)}
                                            >
                                                Enter Handover Code
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            )}
                            
                            {borrowRequest.status === 'denied' && (
                                <Alert severity="error">
                                    This request has been denied by the owner.
                                </Alert>
                            )}
                            
                            {borrowRequest.status === 'completed' && (
                                <Alert severity="success">
                                    This item has been successfully borrowed. You can view the active lending in your lending history.
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {/* QR Code Dialog */}
            <Dialog open={openQrDialog} onClose={() => setOpenQrDialog(false)}>
                <DialogTitle>QR Code for Item Handover</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Show this QR code to the borrower. They will scan it to confirm receipt of the item.
                        This code is valid for 15 minutes.
                    </DialogContentText>
                    
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                        {qrCode ? (
                            <div dangerouslySetInnerHTML={{ __html: atob(qrCode) }} />
                        ) : (
                            <CircularProgress />
                        )}
                    </Box>
                    
                    {borrowRequest.handover_code && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Manual Code
                            </Typography>
                            <Typography variant="h5" sx={{ letterSpacing: 2 }}>
                                {borrowRequest.handover_code}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQrDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            
            {/* Deny Dialog */}
            <Dialog open={openDenyDialog} onClose={() => setOpenDenyDialog(false)}>
                <DialogTitle>Deny Borrow Request</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to deny this request? You can optionally provide a reason.
                    </DialogContentText>
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason (Optional)"
                        fullWidth
                        multiline
                        rows={3}
                        value={denyData.reason}
                        onChange={(e) => setDenyData('reason', e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDenyDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeny} color="error" disabled={denyProcessing}>
                        Deny Request
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Verify Code Dialog */}
            <Dialog open={openVerifyDialog} onClose={() => setOpenVerifyDialog(false)}>
                <DialogTitle>Verify Item Handover</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Enter the code shown by the item owner to confirm you've received the item.
                    </DialogContentText>
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Handover Code"
                        fullWidth
                        value={verifyData.code}
                        onChange={(e) => setVerifyData('code', e.target.value)}
                        inputProps={{ 
                            style: { textTransform: 'uppercase', letterSpacing: 3 },
                            maxLength: 6
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenVerifyDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={handleVerifyCode} 
                        color="primary" 
                        disabled={verifyProcessing || !verifyData.code.trim()}
                    >
                        Verify Code
                    </Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
} 