import { useForm, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GlassPaper from '@/Components/GlassPaper';
import ImageInput from '@/Components/ImageInput';
import { useTranslation } from 'react-i18next';
import { lightTokens } from '@/lightTheme';

export default function Create() {
    const { t } = useTranslation();
    const theme = useTheme();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('items.store'));
    };

    const handleImageChange = (file: File | null) => {
        setData('image', file);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {t('items.addNewItem')}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <GlassPaper
                        sx={{
                            borderRadius: theme.palette.mode === 'dark' ? 2 : '28px',
                            boxShadow: theme.palette.mode === 'dark' 
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                                : lightTokens.shadow,
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

                                        <ImageInput
                                            value={data.image}
                                            onChange={handleImageChange}
                                            error={errors.image}
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
                    </GlassPaper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
