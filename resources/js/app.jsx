import '../css/app.css';
import './bootstrap';
import './i18n'; // Import i18n configuration

import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {createRoot} from 'react-dom/client';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";
import {useMemo} from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function ThemeWrapper({ App, props }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    
    const theme = useMemo(() => createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            background: {
                default: prefersDarkMode ? '#0a0a0f' : '#f4f4f4',
                paper: prefersDarkMode ? '#1a1a1f' : '#fff'
            },
            primary: {
                main: prefersDarkMode ? '#bb86fc' : '#1976d2',
            },
            success: {
                main: '#4caf50',
                dark: '#338327',
                light: '#a5d6a7',
                contrastText: '#fff'
            },
            ...(prefersDarkMode && {
                text: {
                    primary: '#ffffff',
                    secondary: '#b3b3b3'
                }
            })
        }
    }), [prefersDarkMode]);

    return <ThemeProvider theme={theme}><App {...props} /></ThemeProvider>;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
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
