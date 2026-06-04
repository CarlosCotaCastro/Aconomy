import axios from 'axios';
import { getCsrfTokenFromMeta, syncCsrfToken } from './utils/csrf';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function updateCsrfToken(newToken) {
    syncCsrfToken(newToken);
}

const token = getCsrfTokenFromMeta();
if (token) {
    syncCsrfToken(token);
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

window.axios.interceptors.response.use(
    (response) => {
        const newToken = response.headers['x-csrf-token'];
        if (newToken) {
            updateCsrfToken(newToken);
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 419) {
            console.warn('CSRF token expired, attempting to refresh...');
            window.axios.get('/csrf-token').then((response) => {
                if (response.data.token) {
                    updateCsrfToken(response.data.token);
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.token;
                    return window.axios.request(error.config);
                }
            }).catch(() => {
                window.location.reload();
            });
        }
        return Promise.reject(error);
    }
);

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const reverbScheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http';
const reverbPort = import.meta.env.VITE_REVERB_PORT ?? '8080';

try {
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: reverbPort,
        wssPort: reverbPort,
        forceTLS: reverbScheme === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/broadcasting/auth',
        csrfToken: token ?? null,
        withCredentials: true,
        disableStats: true,
    });

    console.log('Laravel Echo (Reverb) initialized successfully');

    const connection = window.Echo.connector?.pusher?.connection;
    if (connection) {
        connection.bind('connected', () => {
            console.log('Reverb WebSocket connected');
        });
        connection.bind('error', (error) => {
            console.warn('Reverb connection error:', error);
        });
    }
} catch (error) {
    console.error('Failed to initialize Laravel Echo:', error);
}
