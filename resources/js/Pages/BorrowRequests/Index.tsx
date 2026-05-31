import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Grid,
    Button,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    useTheme,
} from '@mui/material';
import {
    Send as SendIcon,
    Receipt as ReceiptIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
    Person as PersonIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPaper from '@/Components/GlassPaper';
import { lightTokens } from '@/lightTheme';

// Helper function to get status icon
const getStatusIcon = (status) => {
    switch (status) {
        case 'pending':
            return <PendingIcon color="warning" />;
        case 'approved':
            return <CheckCircleIcon color="success" />;
        case 'denied':
            return <CancelIcon color="error" />;
        case 'completed':
            return <CheckCircleIcon color="success" />;
        default:
            return <PendingIcon />;
    }
};

// Helper function to get status color
const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'approved':
            return 'success';
        case 'denied':
            return 'error';
        case 'completed':
            return 'success';
        default:
            return 'default';
    }
};

export default function Index({ outgoingRequests, incomingRequests, auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <AuthenticatedLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('borrowRequests.borrowRequests')}
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="borrow requests tabs">
                    <Tab
                        icon={<SendIcon />}
                        label={t('borrowRequests.sentRequests', { count: outgoingRequests.length })}
                        id="tab-0"
                        aria-controls="tabpanel-0"
                    />
                    <Tab
                        icon={<ReceiptIcon />}
                        label={t('borrowRequests.receivedRequests', { count: incomingRequests.length })}
                        id="tab-1"
                        aria-controls="tabpanel-1"
                    />
                </Tabs>
            </Box>

            {/* Outgoing Requests */}
            <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        {outgoingRequests.length > 0 ? (
                            outgoingRequests.map((request) => (
                                <Grid size={{xs: 12}} key={request.id}>
                                    <GlassPaper 
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: theme.palette.mode === 'dark' ? 2 : '28px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: theme.palette.mode === 'dark' 
                                                    ? 'rgba(255, 255, 255, 0.05)' 
                                                    : lightTokens.surfaceSolid,
                                                transform: 'translateY(-2px)',
                                                boxShadow: theme.palette.mode === 'dark'
                                                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                                    : lightTokens.hoverShadow,
                                            }
                                        }} 
                                        onClick={() => router.get(route('borrow-requests.show', request.id))}
                                    >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" component="h2">
                                                    {request.item.name}
                                                </Typography>
                                                <Chip
                                                    icon={getStatusIcon(request.status)}
                                                    label={t(`borrowRequests.status.${request.status}`)}
                                                    color={getStatusColor(request.status)}
                                                    size="small"
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="body2">
                                                    {t('borrowRequests.owner', { name: request.lender.name })}
                                                </Typography>
                                            </Box>

                                            {request.message && (
                                                <Box sx={{ 
                                                    mt: 2, 
                                                    p: 2, 
                                                    background: theme.palette.mode === 'dark' 
                                                        ? 'rgba(255, 255, 255, 0.03)' 
                                                        : 'rgba(255, 138, 76, 0.05)',
                                                    border: theme.palette.mode === 'dark' 
                                                        ? '1px solid rgba(255, 255, 255, 0.08)' 
                                                        : `1px solid ${lightTokens.border}`,
                                                    borderRadius: theme.palette.mode === 'dark' ? 1 : '18px',
                                                }}>
                                                    <Typography variant="body2" fontStyle="italic" color="text.secondary">
                                                        "{request.message}"
                                                    </Typography>
                                                </Box>
                                            )}
                                    </GlassPaper>
                                </Grid>
                            ))
                        ) : (
                            <Grid>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        {t('borrowRequests.noSentRequests')}
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href={route('groups.index')}
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                    >
                                        {t('borrowRequests.browseGroups')}
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>

            {/* Incoming Requests */}
            <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
                {tabValue === 1 && (
                    <Grid container spacing={3}>
                        {incomingRequests.length > 0 ? (
                            incomingRequests.map((request) => (
                                <Grid size={{xs: 12}} key={request.id}>
                                    <GlassPaper 
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: theme.palette.mode === 'dark' ? 2 : '28px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: theme.palette.mode === 'dark' 
                                                    ? 'rgba(255, 255, 255, 0.05)' 
                                                    : lightTokens.surfaceSolid,
                                                transform: 'translateY(-2px)',
                                                boxShadow: theme.palette.mode === 'dark'
                                                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                                    : lightTokens.hoverShadow,
                                            }
                                        }} 
                                        onClick={() => router.get(route('borrow-requests.show', request.id))}
                                    >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" component="h2">
                                                    {request.item.name}
                                                </Typography>
                                                <Chip
                                                    icon={getStatusIcon(request.status)}
                                                    label={t(`borrowRequests.status.${request.status}`)}
                                                    color={getStatusColor(request.status)}
                                                    size="small"
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="body2">
                                                    {t('borrowRequests.requestedBy', { name: request.borrower.name })}
                                                </Typography>
                                            </Box>

                                            {request.message && (
                                                <Box sx={{ 
                                                    mt: 2, 
                                                    p: 2, 
                                                    background: theme.palette.mode === 'dark' 
                                                        ? 'rgba(255, 255, 255, 0.03)' 
                                                        : 'rgba(255, 138, 76, 0.05)',
                                                    border: theme.palette.mode === 'dark' 
                                                        ? '1px solid rgba(255, 255, 255, 0.08)' 
                                                        : `1px solid ${lightTokens.border}`,
                                                    borderRadius: theme.palette.mode === 'dark' ? 1 : '18px',
                                                }}>
                                                    <Typography variant="body2" fontStyle="italic" color="text.secondary">
                                                        "{request.message}"
                                                    </Typography>
                                                </Box>
                                            )}
                                    </GlassPaper>
                                </Grid>
                            ))
                        ) : (
                            <Grid>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        {t('borrowRequests.noIncomingRequests')}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
        </AuthenticatedLayout>
    );
}
