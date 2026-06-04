import { useRef, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    Avatar,
    Alert,
    Chip,
    Divider,
    DialogContentText,
    CircularProgress,
    useTheme,
    InputAdornment,
    IconButton,
} from '@mui/material';
import GlassPaper from '@/Components/GlassPaper';
import GlassDialog from '@/Components/GlassDialog';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    QrCode2 as QrCodeIcon,
    Schedule as ScheduleIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { lightTokens } from '@/lightTheme';
import { format, parseISO } from 'date-fns';

function formatDate(value) {
    if (!value) {
        return null;
    }
    try {
        return format(parseISO(value), 'PP');
    } catch {
        return null;
    }
}

function toInputDate(value) {
    if (!value) {
        return '';
    }
    try {
        return parseISO(value).toISOString().slice(0, 10);
    } catch {
        return '';
    }
}

export default function Show({ borrowRequest, qrCode, codeExpiresAt, auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [openQrDialog, setOpenQrDialog] = useState(false);
    const [openDenyDialog, setOpenDenyDialog] = useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
    const [openCounterDialog, setOpenCounterDialog] = useState(false);
    const counterDateInputRef = useRef<HTMLInputElement>(null);

    const { data: approveData, post: approvePost, processing: approveProcessing } = useForm({});
    const { data: denyData, setData: setDenyData, post: denyPost, processing: denyProcessing } = useForm({
        reason: '',
    });
    const { data: verifyData, setData: setVerifyData, post: verifyPost, processing: verifyProcessing } = useForm({
        code: '',
    });
    const { data: counterData, setData: setCounterData, post: counterPost, processing: counterProcessing } = useForm({
        proposed_due_at: toInputDate(borrowRequest.requested_due_at),
    });
    const { post: acceptCounterPost, processing: acceptCounterProcessing } = useForm({});
    const { post: declineCounterPost, processing: declineCounterProcessing } = useForm({});

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

    const handleCounter = () => {
        counterPost(route('borrow-requests.counter', borrowRequest.id));
        setOpenCounterDialog(false);
    };

    const handleAcceptCounter = () => {
        acceptCounterPost(route('borrow-requests.accept-counter', borrowRequest.id));
    };

    const handleDeclineCounter = () => {
        declineCounterPost(route('borrow-requests.decline-counter', borrowRequest.id));
    };

    // Helper function to get status chip
    const getStatusChip = () => {
        switch(borrowRequest.status) {
            case 'pending':
                return <Chip icon={<ScheduleIcon />} label={t('borrowRequests.status.pending')} color="warning" />;
            case 'approved':
                return <Chip icon={<CheckCircleIcon />} label={t('borrowRequests.status.approved')} color="success" />;
            case 'denied':
                return <Chip icon={<CancelIcon />} label={t('borrowRequests.status.denied')} color="error" />;
            case 'completed':
                return <Chip icon={<CheckCircleIcon />} label={t('borrowRequests.status.completed')} color="success" />;
            case 'countered':
                return <Chip icon={<ScheduleIcon />} label={t('borrowRequests.statusCountered')} color="info" />;
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
                    {t('borrowRequests.backToRequests')}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        {t('borrowRequests.requestDetails')}
                    </Typography>
                    {getStatusChip()}
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{md:6, xs:12}}>
                    <GlassPaper
                        sx={{
                            borderRadius: theme.palette.mode === 'dark' ? 2 : '28px',
                        }}
                    >
                            <Typography variant="h6" gutterBottom>
                                {t('borrowRequests.itemDetails')}
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
                                <Grid sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2 }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {t('borrowRequests.owner')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {borrowRequest.lender.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2 }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {t('borrowRequests.borrower')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {borrowRequest.borrower.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ScheduleIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {borrowRequest.agreed_due_at
                                            ? t('borrowRequests.agreedReturnDate')
                                            : borrowRequest.proposed_due_at
                                                ? t('borrowRequests.proposedReturnDate')
                                                : t('borrowRequests.requestedReturnDate')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {formatDate(
                                            borrowRequest.agreed_due_at
                                            || borrowRequest.proposed_due_at
                                            || borrowRequest.requested_due_at,
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            {borrowRequest.message && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t('borrowRequests.messageFromBorrower')}:
                                    </Typography>
                                    <GlassPaper 
                                        sx={{ 
                                            p: 2, 
                                            background: theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.03)' 
                                                : 'rgba(255, 138, 76, 0.05)',
                                        }}
                                    >
                                        <Typography variant="body2" fontStyle="italic">
                                            "{borrowRequest.message}"
                                        </Typography>
                                    </GlassPaper>
                                </Box>
                            )}
                    </GlassPaper>
                </Grid>

                <Grid size={{md:6, xs:12}}>
                    <GlassPaper
                        sx={{
                            borderRadius: theme.palette.mode === 'dark' ? 2 : '28px',
                        }}
                    >
                            <Typography variant="h6" gutterBottom>
                                {t('borrowRequests.requestStatus')}
                            </Typography>

                            {borrowRequest.status === 'pending' && isLender && (
                                <Box sx={{ mt: 2 }}>
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        {t('borrowRequests.pendingRequestInfo', {
                                            borrower: borrowRequest.borrower.name,
                                            item: borrowRequest.item.name
                                        })}
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
                                            {t('borrowRequests.approveRequest')}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => setOpenDenyDialog(true)}
                                            disabled={approveProcessing}
                                            startIcon={<CancelIcon />}
                                            fullWidth
                                        >
                                            {t('borrowRequests.denyRequest')}
                                        </Button>
                                    </Box>

                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={() => setOpenCounterDialog(true)}
                                        startIcon={<ScheduleIcon />}
                                        sx={{ mt: 1.5 }}
                                        fullWidth
                                    >
                                        {t('borrowRequests.proposeShorter')}
                                    </Button>
                                </Box>
                            )}

                            {borrowRequest.status === 'pending' && isBorrower && (
                                <Alert severity="info">
                                    {t('borrowRequests.pendingRequestInfoBorrower')}
                                </Alert>
                            )}

                            {borrowRequest.status === 'countered' && isBorrower && (
                                <Box sx={{ mt: 2 }}>
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        {t('borrowRequests.counteredInfoBorrower', { name: borrowRequest.lender.name })}
                                    </Alert>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleAcceptCounter}
                                            disabled={acceptCounterProcessing}
                                            startIcon={<CheckCircleIcon />}
                                            fullWidth
                                        >
                                            {t('borrowRequests.acceptDate')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleDeclineCounter}
                                            disabled={declineCounterProcessing}
                                            startIcon={<CancelIcon />}
                                            fullWidth
                                        >
                                            {t('borrowRequests.declineRequest')}
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {borrowRequest.status === 'countered' && isLender && (
                                <Alert severity="info">
                                    {t('borrowRequests.counteredInfoLender')}
                                </Alert>
                            )}

                            {borrowRequest.status === 'approved' && (
                                <Box>
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        {t('borrowRequests.approvedRequestInfo')}
                                    </Alert>

                                    {isLender && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {t('borrowRequests.qrCodeForItemHandover')}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {t('borrowRequests.qrCodeForItemHandoverInfo')}
                                            </Typography>

                                            {codeExpiresAt && (
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                                                    {t('borrowRequests.codeExpiresAt', { codeExpiresAt })}
                                                </Typography>
                                            )}

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<QrCodeIcon />}
                                                onClick={() => setOpenQrDialog(true)}
                                            >
                                                {t('borrowRequests.showQRCode')}
                                            </Button>
                                        </Box>
                                    )}

                                    {isBorrower && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {t('borrowRequests.verifyItemHandover')}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {t('borrowRequests.verifyItemHandoverInfo')}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setOpenVerifyDialog(true)}
                                            >
                                                {t('borrowRequests.enterHandoverCode')}
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {borrowRequest.status === 'denied' && (
                                <Alert severity="error">
                                    {t('borrowRequests.deniedRequestInfo')}
                                </Alert>
                            )}

                            {borrowRequest.status === 'completed' && (
                                <Alert severity="success">
                                    {t('borrowRequests.completedRequestInfo')}
                                </Alert>
                            )}
                    </GlassPaper>
                </Grid>
            </Grid>

            {/* QR Code Dialog */}
            <GlassDialog
                open={openQrDialog}
                onClose={() => setOpenQrDialog(false)}
                title={t('borrowRequests.qrCodeForItemHandoverTitle')}
                actions={
                    <Button onClick={() => setOpenQrDialog(false)}>
                        {t('borrowRequests.close')}
                    </Button>
                }
            >
                <DialogContentText sx={{ mb: 2 }}>
                    {t('borrowRequests.qrCodeForItemHandoverInfo')}
                </DialogContentText>

                    <Box sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        background: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.03)' 
                            : 'rgba(255, 138, 76, 0.05)',
                        borderRadius: theme.palette.mode === 'dark' ? 2 : '18px',
                        border: theme.palette.mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.08)' 
                            : `1px solid ${lightTokens.border}`,
                    }}>
                        {qrCode ? (
                            <div dangerouslySetInnerHTML={{ __html: atob(qrCode) }} />
                        ) : (
                            <CircularProgress />
                        )}
                    </Box>

                    {borrowRequest.handover_code && (
                        <Box sx={{ 
                            textAlign: 'center', 
                            mt: 2,
                            p: 2,
                            background: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.05)' 
                                : lightTokens.surface,
                            borderRadius: theme.palette.mode === 'dark' ? 2 : '18px',
                            border: theme.palette.mode === 'dark' 
                                ? '1px solid rgba(255, 255, 255, 0.1)' 
                                : `1px solid ${lightTokens.border}`,
                        }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('borrowRequests.manualCode')}
                            </Typography>
                            <Typography variant="h5" sx={{ letterSpacing: 2, fontFamily: 'monospace' }}>
                                {borrowRequest.handover_code}
                            </Typography>
                        </Box>
                    )}
            </GlassDialog>

            {/* Deny Dialog */}
            <GlassDialog
                open={openDenyDialog}
                onClose={() => setOpenDenyDialog(false)}
                title={t('borrowRequests.denyBorrowRequestTitle')}
                actions={
                    <>
                        <Button onClick={() => setOpenDenyDialog(false)}>
                            {t('borrowRequests.cancel')}
                        </Button>
                        <Button onClick={handleDeny} color="error" disabled={denyProcessing}>
                            {t('borrowRequests.denyRequest')}
                        </Button>
                    </>
                }
            >
                <DialogContentText sx={{ mb: 2 }}>
                    {t('borrowRequests.denyBorrowRequestInfo')}
                </DialogContentText>

                <TextField
                    autoFocus
                    margin="dense"
                    label={t('borrowRequests.reason')}
                    fullWidth
                    multiline
                    rows={3}
                    value={denyData.reason}
                    onChange={(e) => setDenyData('reason', e.target.value)}
                />
            </GlassDialog>

            {/* Verify Code Dialog */}
            <GlassDialog
                open={openVerifyDialog}
                onClose={() => setOpenVerifyDialog(false)}
                title={t('borrowRequests.verifyItemHandoverTitle')}
                actions={
                    <>
                        <Button onClick={() => setOpenVerifyDialog(false)}>
                            {t('borrowRequests.cancel')}
                        </Button>
                        <Button
                            onClick={handleVerifyCode}
                            color="primary"
                            disabled={verifyProcessing || !verifyData.code.trim()}
                        >
                            {t('borrowRequests.verifyCode')}
                        </Button>
                    </>
                }
            >
                <DialogContentText sx={{ mb: 2 }}>
                    {t('borrowRequests.verifyItemHandoverInfo')}
                </DialogContentText>

                <TextField
                    autoFocus
                    margin="dense"
                    label={t('borrowRequests.handoverCode')}
                    fullWidth
                    value={verifyData.code}
                    onChange={(e) => setVerifyData('code', e.target.value)}
                    inputProps={{
                        style: { textTransform: 'uppercase', letterSpacing: 3 },
                        maxLength: 6
                    }}
                />
            </GlassDialog>

            {/* Counter (shorter period) Dialog */}
            <GlassDialog
                open={openCounterDialog}
                onClose={() => setOpenCounterDialog(false)}
                title={t('borrowRequests.proposeShorterTitle')}
                actions={
                    <>
                        <Button onClick={() => setOpenCounterDialog(false)}>
                            {t('borrowRequests.cancel')}
                        </Button>
                        <Button
                            onClick={handleCounter}
                            variant="contained"
                            color="primary"
                            disabled={counterProcessing || !counterData.proposed_due_at}
                        >
                            {t('borrowRequests.proposeDate')}
                        </Button>
                    </>
                }
            >
                <DialogContentText sx={{ mb: 2 }}>
                    {t('borrowRequests.proposeShorterInfo')}
                </DialogContentText>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('borrowRequests.requestedReturnDate')}: {formatDate(borrowRequest.requested_due_at)}
                </Typography>

                <TextField
                    autoFocus
                    margin="dense"
                    type="date"
                    label={t('borrowRequests.newReturnDate')}
                    fullWidth
                    value={counterData.proposed_due_at}
                    onChange={(e) => setCounterData('proposed_due_at', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputRef={counterDateInputRef}
                    inputProps={{ max: toInputDate(borrowRequest.requested_due_at) }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    aria-label={t('borrowRequests.newReturnDate')}
                                    onClick={() => {
                                        const input = counterDateInputRef.current;
                                        if (input?.showPicker) {
                                            input.showPicker();
                                        } else {
                                            input?.focus();
                                        }
                                    }}
                                    tabIndex={-1}
                                >
                                    <EventIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                            opacity: theme.palette.mode === 'dark' ? 0.85 : 0.7,
                            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
                            cursor: 'pointer',
                        },
                    }}
                />
            </GlassDialog>
        </AuthenticatedLayout>
    );
}
