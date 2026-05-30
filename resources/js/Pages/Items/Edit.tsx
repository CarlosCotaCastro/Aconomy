import { useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GlassPaper from '@/Components/GlassPaper';
import ImageInput from '@/Components/ImageInput';

export default function Edit({ item }: { item: any }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: item.name || '',
        description: item.description || '',
        image: null as File | null,
        _method: 'PUT',
    });

    useEffect(() => {
        // Set preview if item has an image
        if (item.image_path) {
            setPreviewUrl(`/storage/${item.image_path}`);
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('items.update', item.id));
    };

    const handleImageChange = (file: File | null) => {
        setData('image', file);
    };

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <GlassPaper
                        sx={{
                            borderRadius: 2,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                                : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {t('items.editItem')}
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

                                    <ImageInput
                                        value={data.image}
                                        onChange={handleImageChange}
                                        error={errors.image}
                                        label={item.image_path ? t('items.changeImage') : t('items.uploadImage')}
                                        showPreview={true}
                                        previewUrl={previewUrl || undefined}
                                        onPreviewChange={(url) => setPreviewUrl(url)}
                                        sx={{ mb: 3 }}
                                    />

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
                            </GlassPaper>
                        </Box>
                    </GlassPaper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
