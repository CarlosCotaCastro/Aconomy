import { PageProps, PaginatedData, Timestamps } from '@/types/common';
import { Item } from '@/Pages/Items/types';
import { User } from '@/types/user';
import { Group } from '@/Pages/Groups/types';

// Lending Types
export interface Lending extends Timestamps {
    id: number;
    item_id: number;
    borrower_id: number;
    start_date: string;
    end_date: string;
    returned_at?: string;
    notes?: string;
    status: 'active' | 'completed' | 'overdue';
    item?: Item;
    borrower?: User;
}

export interface LendingFormData {
    item_id: number;
    borrower_id: number;
    start_date: string;
    end_date: string;
    notes?: string;
}

export interface LendingFilters {
    status?: 'active' | 'completed' | 'overdue';
    item_id?: number;
    borrower_id?: number;
    group_id?: number;
    overdue_only?: boolean;
}

// Return Request Types (part of Lendings)
export interface ReturnRequest extends Timestamps {
    id: number;
    lending_id: number;
    return_date: string;
    condition_notes?: string;
    status: 'pending' | 'approved' | 'rejected';
    response_message?: string;
    responded_at?: string;
    lending?: Lending;
}

export interface ReturnRequestFormData {
    lending_id: number;
    return_date: string;
    condition_notes?: string;
}

export interface ReturnRequestResponseData {
    status: 'approved' | 'rejected';
    response_message?: string;
}

export interface ReturnRequestFilters {
    status?: 'pending' | 'approved' | 'rejected';
    lending_id?: number;
    group_id?: number;
}

// Lending page props
export interface LendingIndexPageProps extends PageProps {
    lendings: PaginatedData<Lending>;
    filters?: LendingFilters;
    groups?: Group[];
    stats?: LendingStats;
}

export interface LendingShowPageProps extends PageProps {
    lending: Lending;
    canReturn?: boolean;
    canExtend?: boolean;
    canCancel?: boolean;
    returnRequests?: any[]; // Will be properly typed when return request types are imported
}

export interface RequestBorrowPageProps extends PageProps {
    item: Item;
    group: Group;
    unavailableDates?: string[];
}

// Lending statistics
export interface LendingStats {
    total_active: number;
    total_completed: number;
    total_overdue: number;
    items_borrowed: number;
    items_lent: number;
}

// Lending filters for search/filtering
export interface LendingSearchFilters extends LendingFilters {
    date_from?: string;
    date_to?: string;
    search?: string;
}


