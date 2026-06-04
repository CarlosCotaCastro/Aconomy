import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { resolveCsrfToken, syncCsrfToken } from '@/utils/csrf';

/**
 * Updates axios and Echo CSRF headers whenever Inertia shared props change.
 */
export default function CsrfTokenSync() {
    const { props } = usePage();

    useEffect(() => {
        const token = resolveCsrfToken(props);
        if (token) {
            syncCsrfToken(token);
        }
    }, [props.csrf_token]);

    return null;
}
