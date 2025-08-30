import { PageProps } from '@/types/common';
import { User } from '@/types/user';
import { Item } from '@/Pages/Items/types';
import { Group } from '@/Pages/Groups/types';
import { Lending } from '@/Pages/Lendings/types';
import { BorrowRequest } from '@/Pages/BorrowRequests/types';

// Dashboard page props
export interface DashboardPageProps extends PageProps {
    stats?: DashboardStats;
    recentItems?: Item[];
    recentLendings?: Lending[];
    pendingBorrowRequests?: BorrowRequest[];
    myGroups?: Group[];
    notifications?: any[]; // Will be properly typed when notification types are imported
}

// Welcome page props
export interface WelcomePageProps extends PageProps {
    features?: FeatureHighlight[];
    testimonials?: Testimonial[];
    stats?: WelcomeStats;
}

// Dashboard statistics
export interface DashboardStats {
    total_items: number;
    active_lendings: number;
    pending_requests: number;
    groups_count: number;
    recent_activity_count: number;
}

// Welcome page data
export interface FeatureHighlight {
    title: string;
    description: string;
    icon: string;
    color?: string;
}

export interface Testimonial {
    name: string;
    text: string;
    avatar?: string;
    rating?: number;
}

export interface WelcomeStats {
    total_users: number;
    total_items: number;
    total_groups: number;
    successful_lendings: number;
}
