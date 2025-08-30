import { User } from './user';

// Base Inertia page props that all pages receive
export interface PageProps {
    auth: {
        user: User;
    };
    csrf_token?: string;
    flash?: {
        message?: string;
        error?: string;
        success?: string;
    };
    errors?: Record<string, string | string[]>;
    [key: string]: any;
}

// Common pagination interface
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Common API response structure
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

// Common form validation errors
export interface ValidationErrors {
    [key: string]: string | string[];
}

// Common status types
export type Status = 'pending' | 'approved' | 'denied' | 'completed' | 'cancelled';

// Common date fields
export interface Timestamps {
    created_at: string;
    updated_at: string;
}
