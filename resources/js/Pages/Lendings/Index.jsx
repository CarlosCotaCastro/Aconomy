import { Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Tabs,
    Tab,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Avatar,
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as VisibilityIcon,
    AssignmentReturn as ReturnIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';

export default function Index({ auth, lendings }) {
    const { post, processing } = useForm();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleReturn = (lendingId) => {
        post(route('lendings.return', lendingId));
    };

    // Check if a lending has an active return request
    const hasActiveReturnRequest = (lending) => {
        return lending.active_return_request !== null;
    };

    // Get lending status text and color based on its state
    const getLendingStatus = (lending) => {
        if (lending.returned_at) {
            return { text: 'Returned', color: 'success' };
        } else if (hasActiveReturnRequest(lending)) {
            return { text: 'Return Requested', color: 'warning' };
        } else {
            return { text: 'Active', color: 'primary' };
        }
    };

    const renderLendingTable = (items) => (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Lender</TableCell>
                        <TableCell>Borrower</TableCell>
                        <TableCell>Lent Date</TableCell>
                        <TableCell>Returned Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        No lendings found
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href={route('lendings.create')}
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        sx={{ 
                                            mt: 2,
                                            borderRadius: 2,
                                            background: 'linear-gradient(90deg, #4caf50 0%, #43a047 100%)',
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Lend an Item
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((lending) => {
                            const status = getLendingStatus(lending);
                            const isLender = auth.user.id === lending.lender.id;
                            const isBorrower = auth.user.id === lending.borrower.id;
                            
                            return (
                                <TableRow 
                                    key={lending.id}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } 
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {lending.item.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={status.text}
                                            color={status.color}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {lending.lender.name}
                                    </TableCell>
                                    <TableCell>
                                        {lending.borrower.name}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(lending.lent_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {lending.returned_at 
                                            ? format(new Date(lending.returned_at), 'MMM d, yyyy')
                                            : '-'
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    component={Link}
                                                    href={route('lendings.show', lending.id)}
                                                    size="small"
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            
                                            {!lending.returned_at && isLender && !hasActiveReturnRequest(lending) && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleReturn(lending.id)}
                                                    disabled={processing}
                                                >
                                                    Mark as Returned
                                                </Button>
                                            )}
                                            
                                            {hasActiveReturnRequest(lending) && isLender && (
                                                <Tooltip title="A return has been requested by the borrower">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="warning"
                                                        component={Link} 
                                                        href={route('lendings.show', lending.id)}
                                                    >
                                                        Review Request
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Lendings</Typography>
                    <Button
                        component={Link}
                        href={route('lendings.create')}
                        variant="contained"
                        color="primary"
                    >
                        Lend an Item
                    </Button>
                </Box>

                <Card>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Lender</TableCell>
                                        <TableCell>Borrower</TableCell>
                                        <TableCell>Lent Date</TableCell>
                                        <TableCell>Returned Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lendings.length > 0 ? (
                                        lendings.map((lending) => {
                                            const status = getLendingStatus(lending);
                                            const isLender = auth.user.id === lending.lender.id;
                                            const isBorrower = auth.user.id === lending.borrower.id;
                                            
                                            return (
                                                <TableRow key={lending.id}>
                                                    <TableCell>{lending.item.name}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={status.text} 
                                                            color={status.color} 
                                                            size="small" 
                                                        />
                                                    </TableCell>
                                                    <TableCell>{lending.lender.name}</TableCell>
                                                    <TableCell>{lending.borrower.name}</TableCell>
                                                    <TableCell>{new Date(lending.lent_at).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        {lending.returned_at 
                                                            ? new Date(lending.returned_at).toLocaleDateString() 
                                                            : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="View Details">
                                                                <IconButton 
                                                                    component={Link} 
                                                                    href={route('lendings.show', lending.id)}
                                                                    size="small"
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            
                                                            {!lending.returned_at && isLender && !hasActiveReturnRequest(lending) && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    onClick={() => handleReturn(lending.id)}
                                                                    disabled={processing}
                                                                >
                                                                    Mark as Returned
                                                                </Button>
                                                            )}
                                                            
                                                            {hasActiveReturnRequest(lending) && isLender && (
                                                                <Tooltip title="A return has been requested by the borrower">
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        color="warning"
                                                                        component={Link} 
                                                                        href={route('lendings.show', lending.id)}
                                                                    >
                                                                        Review Request
                                                                    </Button>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No lendings found. Start by lending an item to someone in your groups.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
} 