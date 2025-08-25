import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

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
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: { xs: 2, sm: 4 },
                            borderRadius: 2,
                            ...(theme.palette.mode === 'dark' && {
                                background: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            })
                        }}
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </Paper>

                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: { xs: 2, sm: 4 },
                            borderRadius: 2,
                            ...(theme.palette.mode === 'dark' && {
                                background: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            })
                        }}
                    >
                        <UpdatePasswordForm className="max-w-xl" />
                    </Paper>

                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: { xs: 2, sm: 4 },
                            borderRadius: 2,
                            ...(theme.palette.mode === 'dark' && {
                                background: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            })
                        }}
                    >
                        <DeleteUserForm className="max-w-xl" />
                    </Paper>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
