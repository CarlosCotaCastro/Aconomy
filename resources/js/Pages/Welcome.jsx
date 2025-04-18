import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome to Aconomy" />

            <div className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-950 relative overflow-hidden">

                {/* Content */}
                <div className="relative z-10 px-6 py-8 md:px-12">
                    {/* Header */}
                    <header className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 text-white mr-4">
                                <ApplicationLogo />
                            </div>
                            {/*<h1 className="text-2xl md:text-3xl font-bold text-white">Aconomy</h1>*/}
                        </div>
                        <nav>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-6 py-2 text-white border border-white border-opacity-30 shadow-lg hover:bg-opacity-30 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="text-white hover:text-purple-200 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-6 py-2 text-white border border-white border-opacity-30 shadow-lg hover:bg-opacity-30 transition"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </header>

                    {/* Hero Section */}
                    <div className="max-w-7xl mx-auto mt-24 md:mt-32">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    Share Resources, Build Community
                                </h2>
                                <p className="mt-6 text-xl text-purple-100">
                                    A new kind of economy focused on sharing, mutual aid, and community empowerment.
                                </p>
                                <div className="mt-8">
                                    <PrimaryButton
                                        href={route('register')}
                                        className={'w-full'}
                                    >
                                        Get Started
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
                        How Aconomy Works
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-center text-xl text-gray-600">
                        A platform built on principles of mutual aid, resource sharing, and community building.
                    </p>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 shadow-lg transform transition hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Form Groups</h3>
                            <p className="mt-4 text-gray-600">
                                Create or join community groups to share resources with people you trust.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 shadow-lg transform transition hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center mb-6">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Share Items</h3>
                            <p className="mt-4 text-gray-600">
                                List items you're willing to share, and borrow what you need from others.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-8 shadow-lg transform transition hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center mb-6">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Build Community</h3>
                            <p className="mt-4 text-gray-600">
                                Create a sustainable local economy based on trust and mutual support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 mr-3">
                            <ApplicationLogo />
                        </div>
                        <p className="text-sm">
                            Aconomy - Alternative Economy Platform
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 text-sm text-gray-400">
                        <p>Powered by Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
