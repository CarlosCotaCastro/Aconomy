import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-row items-center justify-center bg-gray-100">
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                <div className="flex items-center justify-center">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500"/>
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
