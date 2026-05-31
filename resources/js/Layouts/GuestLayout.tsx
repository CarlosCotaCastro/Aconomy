import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useTheme } from '@mui/material/styles';

export default function GuestLayout({ children }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <div style={{ background: isDark ? '#0a0a0f' : theme.palette.background.default }}>
        <div className={`${isDark ? 'custom-hero-bg' : 'light-hero-bg'} flex h-screen flex-row items-center justify-center`}>
            <div
                className="w-full overflow-hidden px-6 py-4 sm:mx-6 md:max-w-md sm:rounded-[28px]"
                style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.74)',
                    backdropFilter: 'blur(10px)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(20,20,20,0.08)',
                    boxShadow: isDark ? 'none' : '0 18px 40px rgba(0,0,0,0.08)',
                }}
            >
                <div className="flex items-center justify-center">
                    <Link href="/">
                        <div style={{ color: isDark ? '#fff' : theme.palette.text.primary }}>
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
