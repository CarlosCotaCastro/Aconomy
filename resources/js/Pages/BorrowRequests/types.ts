import { PageProps, PaginatedData, Timestamps } from '@/types/common';
import { Item } from '@/types/item';
import { Group } from '@/types/group';
import { User } from '@/types/user';

// Borrow Request Types
export interface BorrowRequest extends Timestamps {
    id: number;
    item_id: number;
    requester_id: number;
    start_date: string;
    end_date: string;
    message?: string;
    status: 'pending' | 'approved' | 'denied';
    response_message?: string;
    responded_at?: string;
    item?: Item;
    requester?: User;
}

export interface BorrowRequestFormData {
    item_id: number;
    start_date: string;
    end_date: string;
    message?: string;
}

export interface BorrowRequestResponseData {
    status: 'approved' | 'denied';
    response_message?: string;
}

export interface BorrowRequestFilters {
    status?: 'pending' | 'approved' | 'denied';
    item_id?: number;
    requester_id?: number;
    group_id?: number;
}

// Borrow request page props
export interface BorrowRequestIndexPageProps extends PageProps {
    borrowRequests: PaginatedData<BorrowRequest>;
    filters?: BorrowRequestFilters;
    stats?: BorrowRequestStats;
}

export interface BorrowRequestShowPageProps extends PageProps {
    borrowRequest: BorrowRequest;
    canRespond?: boolean;
    canCancel?: boolean;
    canEdit?: boolean;
}

export interface BorrowRequestCreatePageProps extends PageProps {
    item: Item;
    group: Group;
    unavailableDates?: string[];
    suggestedDates?: DateRange[];
}

// Borrow request statistics
export interface BorrowRequestStats {
    total_pending: number;
    total_approved: number;
    total_denied: number;
    requests_sent: number;
    requests_received: number;
}

// Date range for availability
export interface DateRange {
    start: string;
    end: string;
}

// Borrow request search filters
export interface BorrowRequestSearchFilters extends BorrowRequestFilters {
    date_from?: string;
    date_to?: string;
    search?: string;
    type?: 'sent' | 'received' | 'all';
}
