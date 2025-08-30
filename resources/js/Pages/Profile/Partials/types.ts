import { User } from '@/types/user';
import { ProfileUpdateFormData, PasswordUpdateFormData } from '@/Pages/Profile/types';

// Profile partial component props
export interface UpdateProfileInformationFormProps {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    user?: User;
}

export interface UpdatePasswordFormProps {
    className?: string;
}

export interface DeleteUserFormProps {
    className?: string;
}

// Profile image upload specific props
export interface ProfileImageUploadProps {
    user: User;
    onImageUpdate?: (imagePath: string) => void;
    maxSize?: number; // in MB
    allowedTypes?: string[];
    className?: string;
}

// Image crop data
export interface CropData {
    x: number;
    y: number;
    width: number;
    height: number;
    unit?: 'px' | '%';
}


