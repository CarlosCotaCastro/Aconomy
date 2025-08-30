import { PageProps } from '@/types/common';

// Auth Form Types
export interface LoginFormData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ForgotPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

// Auth page props
export interface LoginPageProps extends PageProps {
    status?: string;
    canResetPassword?: boolean;
}

export interface RegisterPageProps extends PageProps {
    // Add any register-specific props here
}

export interface ForgotPasswordPageProps extends PageProps {
    status?: string;
}

export interface ResetPasswordPageProps extends PageProps {
    token: string;
    email: string;
}

export interface VerifyEmailPageProps extends PageProps {
    status?: string;
}

export interface ConfirmPasswordPageProps extends PageProps {
    // Add any confirm password specific props here
}


