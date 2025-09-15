import { PageProps, PaginatedData, Timestamps } from '@/types/common';
import { Item } from '@/Pages/Items/types';
import { User } from '@/types/user';

// Group Types
export interface Group extends Timestamps {
    id: number;
    name: string;
    description?: string;
    image_path?: string;
    banner_image_path?: string;
    avatar_image_path?: string;
    is_public: boolean;
    join_code?: string;
    users?: User[];
    items?: Item[];
    members_count?: number;
    items_count?: number;
}

export interface GroupJoinRequest extends Timestamps {
    id: number;
    user_id: number;
    group_id: number;
    status: 'pending' | 'approved' | 'denied';
    message?: string;
    user?: User;
    group?: Group;
}

export interface GroupFormData {
    name: string;
    description: string;
    is_public: boolean;
    image?: File;
}

// Group page props
export interface GroupIndexPageProps extends PageProps {
    groups: PaginatedData<Group>;
    filters?: GroupSearchFilters;
}

export interface GroupShowPageProps extends PageProps {
    group: Group;
    items?: PaginatedData<Item>;
    members?: User[];
    isGroupCreator?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canLeave?: boolean;
    canAddItems?: boolean;
    canManageMembers?: boolean;
    joinRequests?: GroupJoinRequest[];
}

export interface GroupCreatePageProps extends PageProps {
    // Add any create-specific props here
}

export interface MyGroupsPageProps extends PageProps {
    ownedGroups: Group[];
    memberGroups: Group[];
    joinRequests: GroupJoinRequest[];
}

// Group search filters
export interface GroupSearchFilters {
    search?: string;
    is_public?: boolean;
    member_of?: boolean;
    owned_by_me?: boolean;
}

// Group partials props
export interface GroupItemSearchProps {
    group: Group;
    items: Item[];
    onItemSelect?: (item: Item) => void;
}

export interface GroupMemberListProps {
    group: Group;
    members: User[];
    canManageMembers?: boolean;
    onMemberRemove?: (userId: number) => void;
}

export interface RecentItemsGridProps {
    items: Item[];
    title?: string;
    showOwner?: boolean;
    onItemClick?: (item: Item) => void;
}


