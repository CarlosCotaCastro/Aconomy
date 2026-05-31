import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {Button} from "@mui/material";

export default function VerifyEmail({ status }) {
    const { post: resendVerification, processing } = useForm({});
    const { post: logout } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        resendVerification(route('verification.send'));
    };

    const handleLogout = () => {
        logout(route('logout'), {
            onError: (errors) => {
                console.error('Logout error:', errors);
                // If CSRF token error, reload the page
                if (errors.status === 419) {
                    window.location.reload();
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-700 dark:text-white">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                    <PrimaryButton disabled={processing} type={'submit'} className='w-full' sx={{my: 2}}>
                        Resend Verification Email
                    </PrimaryButton>

                    <Button
                        onClick={handleLogout}
                        variant={'text'}
                        className="w-full rounded-md text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Log Out
                    </Button>
            </form>
        </GuestLayout>
    );
}
