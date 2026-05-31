import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, useTheme } from '@mui/material';
import GlassPaper from '@/Components/GlassPaper';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import NotificationPreferencesForm from './Partials/NotificationPreferencesForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" component="h2" sx={{ 
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? 'text.primary' : 'text.primary'
                }}>
                    {t('profile.myProfile')}
                </Typography>
            }
        >
            <Head title={t('profile.myProfile')} />

            <Box sx={{ py: 6 }}>
                <Box sx={{ 
                    maxWidth: '896px', 
                    mx: 'auto',
                    px: { xs: 2, sm: 3, lg: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <GlassPaper sx={{ p: { xs: 2, sm: 4 } }}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </GlassPaper>

                    <GlassPaper sx={{ p: { xs: 2, sm: 4 } }}>
                        <NotificationPreferencesForm className="max-w-xl" />
                    </GlassPaper>

                    <GlassPaper sx={{ p: { xs: 2, sm: 4 } }}>
                        <UpdatePasswordForm className="max-w-xl" />
                    </GlassPaper>

                    <GlassPaper sx={{ p: { xs: 2, sm: 4 } }}>
                        <DeleteUserForm className="max-w-xl" />
                    </GlassPaper>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
