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
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme,
    Avatar,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function Index({ auth, lendings }) {
    const { t } = useTranslation();
    const { post, processing } = useForm();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
            return { text: t('lendings.returned'), color: 'success' };
        } else if (hasActiveReturnRequest(lending)) {
            return { text: t('lendings.returnRequested'), color: 'warning' };
        } else {
            return { text: t('lendings.active'), color: 'primary' };
        }
    };

    // Define which columns to show based on screen size
    const getVisibleColumns = () => {
        if (isMobile) {
            return ['item', 'status', 'actions'];
        }
        if (isTablet) {
            return ['item', 'status', 'lender', 'borrower', 'actions'];
        }
        return ['item', 'status', 'lender', 'borrower', 'lentDate', 'returnedDate', 'actions'];
    };

    const visibleColumns = getVisibleColumns();

    const renderTableHeader = () => (
        <TableHead>
            <TableRow>
                {visibleColumns.includes('item') && <TableCell>{t('items.itemName')}</TableCell>}
                {visibleColumns.includes('status') && <TableCell>{t('lendings.lendingStatus')}</TableCell>}
                {visibleColumns.includes('lender') && <TableCell>{t('lendings.lender')}</TableCell>}
                {visibleColumns.includes('borrower') && <TableCell>{t('lendings.borrower')}</TableCell>}
                {visibleColumns.includes('lentDate') && <TableCell>{t('lendings.lendingDate')}</TableCell>}
                {visibleColumns.includes('returnedDate') && <TableCell>{t('lendings.returnedDate')}</TableCell>}
                {visibleColumns.includes('actions') && <TableCell align="right">{t('common.actions')}</TableCell>}
            </TableRow>
        </TableHead>
    );

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

    const renderUserCell = (user) => {
        const isCurrentUser = user.id === auth.user.id;
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!isCurrentUser && (
                    user.profile_image_path ? (
                        <Avatar
                            src={`/storage/${user.profile_image_path}`}
                            alt={user.name}
                            sx={{ width: 24, height: 24 }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: 24,
                                height: 24,
                                bgcolor: stringToColor(user.name),
                                fontSize: '0.875rem'
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                    )
                )}
                <Typography variant="body2">
                    {isCurrentUser ? t('common.me') : user.name}
                </Typography>
            </Box>
        );
    };

    const renderTableRow = (lending) => {
        const status = getLendingStatus(lending);
        const isLender = auth.user.id === lending.lender.id;

        return (
            <TableRow
                key={lending.id}
                sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                }}
            >
                {visibleColumns.includes('item') && (
                    <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {lending.item.name}
                            </Typography>
                            {isMobile && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 0.5,
                                    mt: 0.5,
                                    color: 'text.secondary',
                                    fontSize: '0.875rem'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                            {t('lendings.lender')}:
                                        </Typography>
                                        {renderUserCell(lending.lender)}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                            {t('lendings.borrower')}:
                                        </Typography>
                                        {renderUserCell(lending.borrower)}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </TableCell>
                )}
                {visibleColumns.includes('status') && (
                    <TableCell>
                        <Chip
                            label={status.text}
                            color={status.color}
                            size="small"
                        />
                    </TableCell>
                )}
                {visibleColumns.includes('lender') && !isMobile && (
                    <TableCell>{renderUserCell(lending.lender)}</TableCell>
                )}
                {visibleColumns.includes('borrower') && !isMobile && (
                    <TableCell>{renderUserCell(lending.borrower)}</TableCell>
                )}
                {visibleColumns.includes('lentDate') && (
                    <TableCell>
                        {format(new Date(lending.lent_at), 'MMM d, yyyy')}
                    </TableCell>
                )}
                {visibleColumns.includes('returnedDate') && (
                    <TableCell>
                        {lending.returned_at
                            ? format(new Date(lending.returned_at), 'MMM d, yyyy')
                            : '-'
                        }
                    </TableCell>
                )}
                {visibleColumns.includes('actions') && (
                    <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
                                    {isMobile ? 'Return' : 'Mark as Returned'}
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
                                        {isMobile ? 'Review' : 'Review Request'}
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>
                    </TableCell>
                )}
            </TableRow>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {t('lendings.activeLendings')}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" component="h1">
                                    {t('lendings.activeLendings')}
                                </Typography>
                            </Box>

                            {lendings.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        {t('lendings.noActiveLendings')}
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        {renderTableHeader()}
                                        <TableBody>
                                            {lendings.map(renderTableRow)}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 