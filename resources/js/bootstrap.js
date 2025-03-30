import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add CSRF token to all axios requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

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