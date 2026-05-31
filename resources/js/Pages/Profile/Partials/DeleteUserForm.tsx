import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

export default function DeleteUserForm({ className = '' }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className={`text-lg font-medium ${
                    isDark ? 'text-white' : 'text-[#171717]'
                }`}>
                    {t('profile.deleteAccount')}
                </h2>

                <p className={`mt-1 text-sm ${
                    isDark ? 'text-gray-300' : 'text-[#66645f]'
                }`}>
                    {t('profile.deleteAccountDescription')}
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                {t('profile.deleteAccount')}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className={`text-lg font-medium ${
                        isDark ? 'text-white' : 'text-[#171717]'
                    }`}>
                        {t('profile.deleteAccountConfirmation')}
                    </h2>

                    <p className={`mt-1 text-sm ${
                        isDark ? 'text-gray-300' : 'text-[#66645f]'
                    }`}>
                        {t('profile.deleteAccountWarning')}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={t('profile.password')}
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder={t('profile.password')}
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {t('profile.cancel')}
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {t('profile.deleteAccount')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
