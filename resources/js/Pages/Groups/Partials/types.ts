import { Item } from '@/Pages/Items/types';
import { User } from '@/types/user';
import { Group } from '@/Pages/Groups/types';

// Group partial component types
export interface GroupItemSearchProps {
    group: Group;
    items: Item[];
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    onItemSelect?: (item: Item) => void;
    loading?: boolean;
}

export interface GroupMemberListProps {
    group: Group;
    members: User[];
    canManageMembers?: boolean;
    onMemberRemove?: (userId: number) => void;
    onMemberPromote?: (userId: number) => void;
    loading?: boolean;
}

export interface RecentItemsGridProps {
    items: Item[];
    currentUserId?: number;
    title?: string;
    showOwner?: boolean;
    showBorrowActions?: boolean;
    maxItems?: number;
    onItemClick?: (item: Item) => void;
    loading?: boolean;
    emptyMessage?: string;
}
