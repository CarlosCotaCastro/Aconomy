import { PageProps } from '@/types/common';
import { User } from '@/types/user';
import { Item } from '@/Pages/Items/types';
import { Group } from '@/Pages/Groups/types';
import { Lending } from '@/Pages/Lendings/types';

// Profile Form Types
export interface ProfileUpdateFormData {
    name: string;
    email: string;
    bio?: string;
    location?: string;
    phone?: string;
}

export interface PasswordUpdateFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface ImageUploadFormData {
    image: File;
    crop_data?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

// Profile page props
export interface ProfileShowPageProps extends PageProps {
    user: User;
    isOwnProfile?: boolean;
    stats?: ProfileStats;
    recentItems?: Item[];
    recentLendings?: Lending[];
}

export interface ProfileEditPageProps extends PageProps {
    mustVerifyEmail?: boolean;
    status?: string;
}

// Profile statistics
export interface ProfileStats {
    total_items: number;
    active_lendings: number;
    completed_lendings: number;
    groups_count: number;
    reputation_score?: number;
    join_date: string;
}

// Profile partial component props
export interface UpdateProfileInformationFormProps {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}

export interface UpdatePasswordFormProps {
    className?: string;
}

export interface DeleteUserFormProps {
    className?: string;
}

// Image upload specific props
export interface ProfileImageUploadProps {
    user: User;
    onImageUpdate?: (imagePath: string) => void;
    maxSize?: number; // in MB
    allowedTypes?: string[];
}


