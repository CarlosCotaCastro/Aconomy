import { PageProps, PaginatedData, Timestamps } from '@/types/common';
import { Group } from '@/types/group';
import { User } from '@/types/user';
import { BorrowRequest } from '@/Pages/BorrowRequests/types';

// Item Types
export interface Item extends Timestamps {
    id: number;
    name: string;
    description?: string;
    image_path?: string;
    owner_id: number;
    group_id: number;
    is_available: boolean;
    category?: string;
    condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
    estimated_value?: number;
    owner?: User;
    group?: Group;
    current_lending?: Lending;
}

export interface ItemFormData {
    name: string;
    description: string;
    group_id: number;
    category?: string;
    condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
    estimated_value?: number;
    image?: File;
}

export interface ItemSearchFilters {
    search?: string;
    group_id?: number;
    category?: string;
    is_available?: boolean;
    owner_id?: number;
}

// Forward declaration for Lending to avoid circular dependency
export interface Lending {
    id: number;
    item_id: number;
    borrower_id: number;
    start_date: string;
    end_date: string;
    returned_at?: string;
    created_at: string;
    updated_at: string;
}

// Item page props
export interface ItemIndexPageProps extends PageProps {
    items: PaginatedData<Item>;
    filters?: ItemSearchFilters;
    groups?: Group[];
}

export interface ItemShowPageProps extends PageProps {
    item: Item;
    canEdit?: boolean;
    canDelete?: boolean;
    canBorrow?: boolean;
    borrowRequests?: BorrowRequest[];
}

export interface ItemCreatePageProps extends PageProps {
    groups: Group[];
}

export interface ItemEditPageProps extends PageProps {
    item: Item;
    groups: Group[];
}

export interface GroupItemsPageProps extends PageProps {
    group: Group;
    items: PaginatedData<Item>;
    filters?: ItemSearchFilters;
    canAddItems?: boolean;
}


