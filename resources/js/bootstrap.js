import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Function to get CSRF token from meta tag
function getCsrfToken() {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    return token ? token.content : null;
}

// Function to update CSRF token in meta tag
function updateCsrfToken(newToken) {
    let token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        token.content = newToken;
    } else {
        // Create meta tag if it doesn't exist
        token = document.createElement('meta');
        token.name = 'csrf-token';
        token.content = newToken;
        document.head.appendChild(token);
    }
}

// Add CSRF token to all axios requests
const token = getCsrfToken();
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    console.log('CSRF token loaded successfully');
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Add response interceptor to handle CSRF token refresh
window.axios.interceptors.response.use(
    (response) => {
        // Check if response contains a new CSRF token
        const newToken = response.headers['x-csrf-token'];
        if (newToken) {
            updateCsrfToken(newToken);
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
            console.log('CSRF token refreshed from response headers');
        }
        return response;
    },
    (error) => {
        // Handle 419 errors (CSRF token mismatch)
        if (error.response && error.response.status === 419) {
            console.warn('CSRF token expired, attempting to refresh...');
            // Try to get a new token by making a GET request
            window.axios.get('/csrf-token').then(response => {
                if (response.data.token) {
                    updateCsrfToken(response.data.token);
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.token;
                    console.log('CSRF token refreshed successfully');
                    // Retry the original request
                    return window.axios.request(error.config);
                }
            }).catch((refreshError) => {
                console.error('Failed to refresh CSRF token:', refreshError);
                // If we can't get a new token, redirect to login
                window.location.reload();
            });
        }
        return Promise.reject(error);
    }
);

import Echo from 'laravel-echo';
import io from 'socket.io-client';

window.io = io;

try {
    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: window.location.hostname + ':6001',
        csrfToken: token ? token.content : '',
        withCredentials: true,
        transports: ['websocket', 'polling'],
        disableStats: true,
    });

    console.log('Laravel Echo initialized successfully');
    
    // Add debug event handlers
    window.Echo.connector.socket.on('connect', () => {
        console.log('Socket.io connected successfully');
    });
    
    window.Echo.connector.socket.on('connect_error', (error) => {
        console.warn('Socket.io connection error:', error.message);
    });
} catch (error) {
    console.error('Failed to initialize Laravel Echo:', error);
}