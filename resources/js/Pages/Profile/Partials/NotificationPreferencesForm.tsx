import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Switch, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function NotificationPreferencesForm({ className = '' }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const user = usePage().props.auth.user;

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        // name & email are required by ProfileUpdateRequest, so we send the
        // current values alongside the preference toggle.
        name: user.name,
        email: user.email,
        email_on_message: user.email_on_message ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-[#171717]'}`}>
                    {t('profile.notificationPreferences')}
                </h2>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-[#66645f]'}`}>
                    {t('profile.notificationPreferencesDescription')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!data.email_on_message}
                                onChange={(e) => setData('email_on_message', e.target.checked)}
                                color="primary"
                            />
                        }
                        label={t('profile.emailOnMessage')}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                        {t('profile.emailOnMessageHint')}
                    </Typography>
                </Box>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('common.save')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className={`text-sm ${isDark ? 'text-green-400' : 'text-[#66645f]'}`}>
                            {t('profile.saved')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
