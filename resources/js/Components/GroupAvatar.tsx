import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';
import { Group } from '@/Pages/Groups/types';

interface GroupAvatarProps extends Omit<AvatarProps, 'src' | 'alt'> {
    group: Group;
    size?: number;
}

export default function GroupAvatar({ group, size = 40, sx = {}, ...props }: GroupAvatarProps) {
    // Generate a color based on the group name
    function stringToColor(string: string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    // Get initials from group name
    function getInitials(name: string) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    return (
        <Avatar
            src={group.avatar_image_path ? `/storage/${group.avatar_image_path}` : undefined}
            alt={group.name}
            sx={{
                width: size,
                height: size,
                bgcolor: !group.avatar_image_path ? stringToColor(group.name) : undefined,
                fontSize: `${size * 0.4}px`,
                ...sx
            }}
            {...props}
        >
            {!group.avatar_image_path && getInitials(group.name)}
        </Avatar>
    );
}
