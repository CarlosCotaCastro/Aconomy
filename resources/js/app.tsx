import '../css/app.css';
import './bootstrap';
import './i18n'; // Import i18n configuration

import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {createRoot} from 'react-dom/client';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";
import {useMemo} from 'react';
import {lightTokens} from './lightTheme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function ThemeWrapper({ App, props }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    
    const theme = useMemo(() => createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            background: {
                default: prefersDarkMode ? '#0a0a0f' : lightTokens.bg,
                paper: prefersDarkMode ? '#1a1a1f' : lightTokens.surfaceSolid
            },
            primary: {
                main: prefersDarkMode ? '#1976d2' : lightTokens.orange2,
                light: prefersDarkMode ? '#1976d2' : lightTokens.orange1,
                dark: prefersDarkMode ? '#1976d2' : lightTokens.orange3,
                contrastText: '#ffffff',
            },
            secondary: {
                main: prefersDarkMode ? '#9c27b0' : lightTokens.indigo,
                light: prefersDarkMode ? '#9c27b0' : lightTokens.lavender,
                contrastText: '#ffffff',
            },
            success: {
                main: prefersDarkMode ? '#4caf50' : lightTokens.green,
                dark: '#338327',
                light: '#a5d6a7',
                contrastText: '#fff'
            },
            ...(prefersDarkMode ? {
                text: {
                    primary: '#ffffff',
                    secondary: '#b3b3b3'
                }
            } : {
                text: {
                    primary: lightTokens.text,
                    secondary: lightTokens.muted,
                },
                divider: lightTokens.border,
            })
        },
        shape: {
            borderRadius: prefersDarkMode ? 4 : 18,
        },
        ...(prefersDarkMode ? {} : {
            typography: {
                fontFamily: "'Inter', sans-serif",
                h1: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.07em', fontWeight: 700 },
                h2: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.07em', fontWeight: 700 },
                h3: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.06em', fontWeight: 700 },
                h4: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.05em', fontWeight: 700 },
                h5: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.04em', fontWeight: 700 },
                h6: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em', fontWeight: 700 },
                button: { textTransform: 'none', fontWeight: 600 },
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 18,
                            textTransform: 'none',
                            fontWeight: 600,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        rounded: {
                            borderRadius: 28,
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            borderRadius: 999,
                        },
                    },
                },
            },
        }),
    }), [prefersDarkMode]);

    return <ThemeProvider theme={theme}><App {...props} /></ThemeProvider>;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({el, App, props}) {
        const root = createRoot(el);

        // Update CSRF token in meta tag when props change
        if (props.csrf_token) {
            const metaTag = document.head.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.content = props.csrf_token;
            }
            // Also update axios default header
            if (window.axios) {
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] = props.csrf_token;
            }
        }

        // Validate CSRF token on app start
        if (!props.csrf_token) {
            console.warn('CSRF token not found in props');
        }

        root.render(<ThemeWrapper App={App} props={props} />);
    },
    progress: {
        color: '#4B5563',
    },
    // Handle errors globally
    onError: (error) => {
        console.error('Inertia error:', error);
        
        if (error.response && error.response.status === 419) {
            // CSRF token mismatch - refresh the page to get a new token
            console.warn('CSRF token expired, refreshing page...');
            window.location.reload();
        } else if (error.response && error.response.status === 401) {
            // Unauthorized - redirect to login
            window.location.href = '/login';
        } else if (error.response && error.response.status >= 500) {
            // Server error
            console.error('Server error:', error.response.data);
        }
    },
});
