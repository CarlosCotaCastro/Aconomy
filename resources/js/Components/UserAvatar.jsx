import React from 'react';
import { Avatar } from '@mui/material';

export default function UserAvatar({ user, size = 32, sx = {}, ...props }) {
    function stringToColor(string) {
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

    function getInitials(name) {
        const wordcount = name.split(' ').length;
        if (wordcount === 1) {
            return name[0].toUpperCase();
        }
        return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
    }

    const hasProfileImage = user.profile_image_path || user.avatar;
    const profileImageSrc = user.profile_image_path 
        ? `/storage/${user.profile_image_path}` 
        : user.avatar;

    return (
        <Avatar
            src={hasProfileImage ? profileImageSrc : undefined}
            alt={user.name}
            sx={{
                width: size,
                height: size,
                bgcolor: !hasProfileImage ? stringToColor(user.name) : undefined,
                fontSize: `${size * 0.4}px`,
                ...sx
            }}
            {...props}
        >
            {!hasProfileImage && getInitials(user.name)}
        </Avatar>
    );
}
