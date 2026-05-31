import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import {Button} from "@mui/material";
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import { useTranslation } from 'react-i18next';

export default function Login({status, canResetPassword}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const {t} = useTranslation();
    const { csrf_token } = usePage().props;


    return (
        <GuestLayout>
            <Head title={t("common.login")}/>



                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" color="text-gray-700 dark:text-white"/>

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2"/>
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" color="text-gray-700 dark:text-white"/>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2"/>
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-700 dark:text-white">
                            Remember me
                        </span>
                        </label>
                    </div>

                    <div className="mt-4">
                        <PrimaryButton className="w-full my-4" disabled={processing} type={'submit'}>
                            Log in
                        </PrimaryButton>
                        {canResetPassword && (
                            <Button
                                component={'a'}
                                variant={'text'}
                                href={route('password.request')}
                                sx={{my: 2, textAlign: 'center', width: '100%'}}
                            >
                                Forgot your password?
                            </Button>
                        )}
                    </div>

                    
                </form>

        </GuestLayout>
    );
}
