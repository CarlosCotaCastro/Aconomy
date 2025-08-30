import { Timestamps } from './common';

export interface User extends Timestamps {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    profile_image_path?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    phone?: string;
}

export interface UserProfile extends User {
    // Additional profile-specific fields if needed
    groups?: any[]; // Will be typed properly when imported from Groups
    items_count?: number;
    lendings_count?: number;
}
