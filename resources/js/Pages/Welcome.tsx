import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import { Button, Divider, Icon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { GitHub } from '@mui/icons-material';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <>
            <Head title={t('common.welcome')} />
            <div style={{ background: "var(--bg-primary)" }}>

                <div className={`${isDark ? 'custom-hero-bg' : 'light-hero-bg'} min-h-screen relative overflow-hidden`}>
                    {/*<div className="min-h-screen bg-gradient-to-br from-teal-950 to-orange-100 relative overflow-hidden">*/}

                    {/* Content */}
                    <div className={`relative z-10 px-6 py-8 md:px-12 border-solid border-b-2 ${isDark ? 'border-cyan-950' : 'border-black/10'} max-w-7xl mx-auto`}>
                        {/* Header */}
                        <header className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={isDark ? 'text-white' : 'text-gray-900'}>
                                    <ApplicationLogo />
                                </div>
                            </div>
                            <nav>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className={`backdrop-blur-lg rounded-2xl px-6 py-2 shadow-lg transition border ${isDark ? 'bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30' : 'bg-white/60 text-gray-900 border-black/10 hover:bg-white/85'}`}
                                    >
                                        {t('dashboard.welcomeBack', { name: auth.user.name })}
                                    </Link>
                                ) : (
                                    <div className="space-x-4">
                                        <Link
                                            href={route('login')}
                                            className={`transition ${isDark ? 'text-white hover:text-purple-200' : 'text-gray-700 hover:text-orange-500'}`}
                                        >
                                            {t('common.login')}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className={`backdrop-blur-lg rounded-2xl px-6 py-2 shadow-lg transition border ${isDark ? 'bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30' : 'bg-white/60 text-gray-900 border-black/10 hover:bg-white/85'}`}
                                        >
                                            {t('common.register')}
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </header>

                        {/* Hero Section */}
                        <div className="py-24 md:py-32">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                                <div>
                                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t('welcome.heroTitle')}
                                    </h2>
                                    <p className={`mt-6 text-xl ${isDark ? 'text-purple-100' : 'text-gray-600'}`}>
                                        {t('welcome.heroSubtitle')}
                                    </p>
                                    <div className="mt-8 text-center">
                                        <PrimaryButton
                                            href={route('register')}
                                            className={'w-full hero-cta-btn'}
                                        >
                                            {t('common.getStarted')}
                                        </PrimaryButton>
                                        <Button variant='text' startIcon={<GitHub />} className="hero-cta-download" href="https://github.com/CarlosCotaCastro/AconomyVibe">
                                            {t('welcome.download.fromGithub')}
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <img src="/hero.png" />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Features Section */}
                    <div className="py-24 px-6">
                        <div className="max-w-7xl mx-auto">
                            <h2 className={`text-3xl md:text-4xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('welcome.howItWorks')}
                            </h2>
                            <p className={`mt-4 max-w-2xl mx-auto text-center text-xl ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                {t('welcome.howItWorksDescription')}
                            </p>

                            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="welcome-card">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                            <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold">{t('welcome.features.groups.title')}</h3>
                                    <p className="mt-4">
                                        {t('welcome.features.groups.description')}
                                    </p>
                                </div>

                                <div className="welcome-card">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                            <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold">{t('welcome.features.items.title')}</h3>
                                    <p className="mt-4">
                                        {t('welcome.features.items.description')}
                                    </p>
                                </div>

                                <div className="welcome-card">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold">{t('welcome.features.community.title')}</h3>
                                    <p className="mt-4">
                                        {t('welcome.features.community.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center">
                        <div className="mr-3">
                            <ApplicationLogo
                            fontSize="1.5em"
                             />
                        </div>
                        <p className="text-sm">
                            {t('welcome.footer.tagline')}
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 text-sm text-gray-400">
                        <p><a href='https://github.com/CarlosCotaCastro/AconomyVibe' target='_blank'>Github Repository</a></p>
                    </div>
                </div>
            </footer>
        </>
    );
}
