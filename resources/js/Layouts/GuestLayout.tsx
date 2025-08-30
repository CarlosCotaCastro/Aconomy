import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div style={{ background: "#0a0a0f" }}>
        <div className="custom-hero-bg flex h-screen flex-row items-center justify-center">
            <div className="w-full overflow-hidden sm:bg-black/20 px-6 py-4 shadow-md sm:mx-6 md:max-w-md sm:rounded-lg">
                <div className="flex items-center justify-center">
                    <Link href="/">
                        <div className="text-white">
                        <ApplicationLogo className="h-20 w-20"/>
                        </div>
                    </Link>
                </div>
                {children}
            </div>
        </div>
        </div>
    );
}
