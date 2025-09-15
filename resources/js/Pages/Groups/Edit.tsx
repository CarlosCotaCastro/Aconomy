import { useForm, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Divider,
} from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GlassPaper from '@/Components/GlassPaper';
import GroupImageUpload from '@/Components/GroupImageUpload';
import { useTranslation } from 'react-i18next';

export default function Edit({ group }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: group.name,
        description: group.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('groups.update', group.id));
    };

    return (
        <AuthenticatedLayout>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('groups.editGroup')}
                </Typography>

                <GlassPaper>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label={t('groups.groupName')}
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label={t('groups.groupDescription')}
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                            multiline
                            rows={4}
                            sx={{ mb: 3 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <PrimaryButton
                                type="submit"
                                variant="contained"
                                disabled={processing}
                            >
                                {t('common.update')}
                            </PrimaryButton>
                            <Button
                                component={Link}
                                href={route('groups.show', group.id)}
                                variant="outlined"
                            >
                                {t('common.cancel')}
                            </Button>
                        </Box>
                    </form>
                </GlassPaper>

                <Divider sx={{ my: 4 }} />

                <GlassPaper>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Group Images
                    </Typography>
                    <GroupImageUpload group={group} isGroupCreator={true} />
                </GlassPaper>
            </Box>
        </AuthenticatedLayout>
    );
}
