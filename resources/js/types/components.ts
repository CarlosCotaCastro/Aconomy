import { ReactNode, MouseEvent, ChangeEvent, FormEvent } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { User } from './user';

// Common component props
export interface BaseComponentProps {
    children?: ReactNode;
    className?: string;
    sx?: SxProps<Theme>;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
}

// Input component props
export interface InputProps extends BaseComponentProps {
    label?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}

// Avatar component props
export interface AvatarProps extends BaseComponentProps {
    user: User;
    size?: number;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

// Form component props
export interface FormProps extends BaseComponentProps {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    processing?: boolean;
    errors?: Record<string, string | string[]>;
}

// Navigation props
export interface NavLinkProps extends BaseComponentProps {
    href: string;
    active?: boolean;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    as?: 'button' | 'a';
    preserveScroll?: boolean;
}

// Dropdown props
export interface DropdownProps extends BaseComponentProps {
    trigger: ReactNode;
    align?: 'left' | 'right';
    width?: number;
    contentClasses?: string;
}
