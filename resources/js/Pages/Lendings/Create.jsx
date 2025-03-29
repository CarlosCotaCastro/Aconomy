import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    FormHelperText,
    Card,
    CardContent,
    Divider,
    Avatar,
    ListItemText,
    OutlinedInput,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import {
    Inventory as InventoryIcon,
    Person as PersonIcon,
    CalendarMonth as CalendarIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ items, potentialBorrowers, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        item_id: '',
        borrower_id: '',
        lent_at: new Date(),
    });

    const [selectedItem, setSelectedItem] = useState(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('lendings.store'), {
            onSuccess: () => {
                // Success handled by controller redirect
            },
        });
    };

    const handleItemChange = (e) => {
        const itemId = e.target.value;
        setData('item_id', itemId);
        setSelectedItem(items.find(item => item.id === itemId) || null);
    };
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ mb: 4 }}>
                <Button
                    component={Link}
                    href={route('lendings.index')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Back to Lendings
                </Button>
                
                <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        background: 'linear-gradient(90deg, #4caf50 0%, #43a047 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Lend an Item
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Create a new lending record to track items you lend to others.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{
                            boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px',
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <FormControl 
                                            fullWidth 
                                            error={!!errors.item_id}
                                            sx={{ 
                                                '& .MuiInputLabel-root': { 
                                                    fontSize: '1rem',
                                                    backgroundColor: 'white',
                                                    px: 0.5,
                                                    '&.Mui-focused': {
                                                        color: '#4caf50',
                                                    },
                                                    '&.MuiInputLabel-shrink': {
                                                        backgroundColor: 'white',
                                                        px: 0.5,
                                                        top: 0
                                                    }
                                                },
                                                '& .MuiSelect-select': {
                                                    py: 1.7,
                                                    px: 2
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                                    legend: {
                                                        maxWidth: '100%'
                                                    }
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#4caf50'
                                                }
                                            }}
                                            variant="outlined"
                                        >
                                            <InputLabel 
                                                id="item-select-label" 
                                                shrink={!!data.item_id}
                                            >
                                                Select Item to Lend
                                            </InputLabel>
                                            <Select
                                                labelId="item-select-label"
                                                value={data.item_id}
                                                onChange={handleItemChange}
                                                label="Select Item to Lend"
                                                notched
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <Typography color="text.secondary">Select an item to lend</Typography>;
                                                    }
                                                    const item = items.find(i => i.id === selected);
                                                    return (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar 
                                                                sx={{ 
                                                                    width: 28, 
                                                                    height: 28, 
                                                                    mr: 1.5, 
                                                                    bgcolor: 'rgba(76, 175, 80, 0.1)' 
                                                                }}
                                                            >
                                                                <InventoryIcon sx={{ fontSize: '1rem', color: '#4caf50' }} />
                                                            </Avatar>
                                                            <Typography>{item ? item.name : ''}</Typography>
                                                        </Box>
                                                    );
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 300,
                                                        },
                                                    },
                                                }}
                                            >
                                                {items.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar 
                                                                sx={{ 
                                                                    width: 28, 
                                                                    height: 28, 
                                                                    mr: 1.5, 
                                                                    bgcolor: 'rgba(76, 175, 80, 0.1)' 
                                                                }}
                                                            >
                                                                <InventoryIcon sx={{ fontSize: '1rem', color: '#4caf50' }} />
                                                            </Avatar>
                                                            <ListItemText 
                                                                primary={item.name} 
                                                                secondary={item.description ? 
                                                                    (item.description.length > 60 ? 
                                                                        `${item.description.substring(0, 60)}...` : 
                                                                        item.description) 
                                                                    : null} 
                                                                primaryTypographyProps={{ fontWeight: 500 }}
                                                                sx={{ my: 0.5 }}
                                                            />
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.item_id && (
                                                <FormHelperText>{errors.item_id}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl 
                                            fullWidth 
                                            error={!!errors.borrower_id}
                                            sx={{ 
                                                '& .MuiInputLabel-root': { 
                                                    fontSize: '1rem',
                                                    backgroundColor: 'white',
                                                    px: 0.5,
                                                    '&.Mui-focused': {
                                                        color: '#8b5cf6',
                                                    },
                                                    '&.MuiInputLabel-shrink': {
                                                        backgroundColor: 'white',
                                                        px: 0.5,
                                                        top: 0
                                                    }
                                                },
                                                '& .MuiSelect-select': {
                                                    py: 1.7,
                                                    px: 2
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                                    legend: {
                                                        maxWidth: '100%'
                                                    }
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#8b5cf6'
                                                }
                                            }}
                                            variant="outlined"
                                        >
                                            <InputLabel 
                                                id="borrower-select-label"
                                                shrink={!!data.borrower_id}
                                            >
                                                Select Borrower
                                            </InputLabel>
                                            <Select
                                                labelId="borrower-select-label"
                                                value={data.borrower_id}
                                                onChange={(e) => setData('borrower_id', e.target.value)}
                                                label="Select Borrower"
                                                notched
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return <Typography color="text.secondary">Select a person to lend to</Typography>;
                                                    }
                                                    const borrower = potentialBorrowers.find(u => u.id === selected);
                                                    return (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar 
                                                                sx={{ 
                                                                    width: 28, 
                                                                    height: 28, 
                                                                    mr: 1.5, 
                                                                    bgcolor: 'rgba(139, 92, 246, 0.1)'
                                                                }}
                                                            >
                                                                <PersonIcon sx={{ fontSize: '1rem', color: '#8b5cf6' }} />
                                                            </Avatar>
                                                            <Typography>{borrower ? borrower.name : ''}</Typography>
                                                        </Box>
                                                    );
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 300,
                                                        },
                                                    },
                                                }}
                                            >
                                                {potentialBorrowers.map((borrower) => (
                                                    <MenuItem key={borrower.id} value={borrower.id}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar 
                                                                sx={{ 
                                                                    width: 28, 
                                                                    height: 28, 
                                                                    mr: 1.5, 
                                                                    bgcolor: 'rgba(139, 92, 246, 0.1)'
                                                                }}
                                                            >
                                                                <PersonIcon sx={{ fontSize: '1rem', color: '#8b5cf6' }} />
                                                            </Avatar>
                                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                {borrower.name}
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.borrower_id && (
                                                <FormHelperText>{errors.borrower_id}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Date Lent"
                                                value={data.lent_at}
                                                onChange={(date) => setData('lent_at', date)}
                                                renderInput={(params) => (
                                                    <TextField 
                                                        {...params} 
                                                        fullWidth 
                                                        error={!!errors.lent_at}
                                                        helperText={errors.lent_at}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={processing}
                                            sx={{ 
                                                borderRadius: 2,
                                                p: 1.5,
                                                background: 'linear-gradient(90deg, #4caf50 0%, #43a047 100%)',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            Create Lending
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px',
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Lending Summary
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            {selectedItem && (
                                <Box>
                                    <Typography 
                                        variant="subtitle2" 
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Selected Item
                                    </Typography>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'flex-start', 
                                            mb: 3,
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(76, 175, 80, 0.05)'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                mr: 2
                                            }}
                                        >
                                            <InventoryIcon sx={{ color: '#4caf50' }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {selectedItem.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedItem.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            
                            {data.borrower_id && (
                                <Box>
                                    <Typography 
                                        variant="subtitle2" 
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Selected Borrower
                                    </Typography>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mb: 3,
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(139, 92, 246, 0.05)'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                                                mr: 2
                                            }}
                                        >
                                            <PersonIcon sx={{ color: '#8b5cf6' }} />
                                        </Avatar>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {potentialBorrowers.find(u => u.id === data.borrower_id)?.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            
                            {data.lent_at && (
                                <Box>
                                    <Typography 
                                        variant="subtitle2" 
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Lending Date
                                    </Typography>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mb: 3,
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(255, 152, 0, 0.05)'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(255, 152, 0, 0.1)',
                                                mr: 2
                                            }}
                                        >
                                            <CalendarIcon sx={{ color: '#ff9800' }} />
                                        </Avatar>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {format(new Date(data.lent_at), 'MMMM d, yyyy')}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Once created, this lending will be visible to both you and the borrower. 
                                    You'll be able to mark it as returned when the item is returned to you.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
} 