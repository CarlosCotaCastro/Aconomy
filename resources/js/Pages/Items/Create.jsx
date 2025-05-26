import { useForm, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Card,
    CardMedia,
    FormHelperText,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import { useTranslation } from 'react-i18next';

export default function Create() {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('items.store'));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);

        // Create preview URL
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {t('items.addNewItem')}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                                <Typography variant="h5" component="h1" gutterBottom>
                                    {t('items.addNewItem')}
                                </Typography>

                                <Paper sx={{ p: 3 }}>
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            fullWidth
                                            label={t('items.itemName')}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            fullWidth
                                            label={t('items.itemDescription')}
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            error={!!errors.description}
                                            helperText={errors.description}
                                            multiline
                                            rows={4}
                                            sx={{ mb: 3 }}
                                        />

                                        <Box sx={{ mb: 3 }}>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ mb: 2 }}
                                            >
                                                {t('items.uploadImage')}
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                />
                                            </Button>

                                            {errors.image && (
                                                <FormHelperText error>{errors.image}</FormHelperText>
                                            )}

                                            {previewUrl && (
                                                <Card sx={{ mt: 2, maxWidth: 300 }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={previewUrl}
                                                        alt={t('items.imagePreview')}
                                                        sx={{ objectFit: 'contain' }}
                                                    />
                                                </Card>
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <PrimaryButton
                                                type="submit"
                                                variant="contained"
                                                disabled={processing}
                                            >
                                                {t('items.createItem')}
                                            </PrimaryButton>
                                            <Button
                                                component={Link}
                                                href={route('items.index')}
                                                variant="outlined"
                                            >
                                                {t('common.cancel')}
                                            </Button>
                                        </Box>
                                    </form>
                                </Paper>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
