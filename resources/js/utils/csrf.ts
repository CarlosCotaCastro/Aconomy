/**
 * Keep CSRF token in sync across meta tag, axios, and Laravel Echo (private channel auth).
 */
export function getCsrfTokenFromMeta(): string | null {
    return document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null;
}

export function syncCsrfToken(token: string): void {
    const meta = document.head.querySelector('meta[name="csrf-token"]');
    if (meta) {
        meta.setAttribute('content', token);
    }

    if (window.axios) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }

    const echo = window.Echo;
    if (echo?.connector?.options) {
        echo.connector.options.csrfToken = token;
        echo.connector.options.auth.headers['X-CSRF-TOKEN'] = token;
        echo.connector.options.userAuthentication.headers['X-CSRF-TOKEN'] = token;
    }
}

export function resolveCsrfToken(inertiaPageProps?: { csrf_token?: string } | null): string | null {
    return inertiaPageProps?.csrf_token ?? getCsrfTokenFromMeta();
}
