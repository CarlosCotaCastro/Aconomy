import { useForm, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('items.store'));
    };

    return (
        <AuthenticatedLayout>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Add New Item
                </Typography>

                <Paper sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                            multiline
                            rows={4}
                            sx={{ mb: 3 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                            >
                                Create Item
                            </Button>
                            <Button
                                component={Link}
                                href={route('items.index')}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </AuthenticatedLayout>
    );
} 