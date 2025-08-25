import { useForm, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardMedia,
    FormHelperText,
    useTheme,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GlassPaper from '@/Components/GlassPaper';
import { useTranslation } from 'react-i18next';

export default function Create() {
    const { t } = useTranslation();
    const theme = useTheme();
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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {t('items.addNewItem')}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Box
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.02)' 
                                : 'rgba(255, 255, 255, 1)',
                            backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                            border: theme.palette.mode === 'dark' 
                                ? '1px solid rgba(255, 255, 255, 0.1)' 
                                : '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: theme.palette.mode === 'dark' 
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                                : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                                <Typography variant="h5" component="h1" gutterBottom>
                                    {t('items.addNewItem')}
                                </Typography>

                                <GlassPaper>
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
                                </GlassPaper>
                            </Box>
                    </Box>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
