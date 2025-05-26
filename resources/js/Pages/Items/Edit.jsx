import { useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
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
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Edit({ item }) {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: item.name || '',
        description: item.description || '',
        image: null,
        _method: 'PUT',
    });

    useEffect(() => {
        // Set preview if item has an image
        if (item.image_path) {
            setPreviewUrl(`/storage/${item.image_path}`);
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('items.update', item.id));
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
        }
    };

    return (
        <AuthenticatedLayout>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('items.editItem')}
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
                                {item.image_path ? t('items.changeImage') : t('items.uploadImage')}
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
                                {t('items.updateItem')}
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
        </AuthenticatedLayout>
    );
}
