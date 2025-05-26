import '../css/app.css';
import './bootstrap';
import './i18n'; // Import i18n configuration

import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {createRoot} from 'react-dom/client';
import {createTheme, ThemeProvider} from "@mui/material/styles";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const theme = createTheme({
    palette: {
        background: {
            default: '#f4f4f4',
            paper: '#fff'
        },
        success: {
            main: '#4caf50',
            dark: '#338327',
            light: '#a5d6a7',
            contrastText: '#fff'
        }
        // text: {
        //     primary: '#fff',
        //     secondary: '#f2f2f2'
        // },
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({el, App, props}) {
        const root = createRoot(el);

        root.render(<ThemeProvider theme={theme}><App {...props} /></ThemeProvider>);
    },
    progress: {
        color: '#4B5563',
    },
});
