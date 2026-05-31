import React from 'react';
import { Box, BoxProps, Typography, IconButton } from '@mui/material';
import { Group as GroupIcon, Edit as EditIcon } from '@mui/icons-material';
import { Group } from '@/Pages/Groups/types';
import { Link } from '@inertiajs/react';
import GroupAvatar from '@/Components/GroupAvatar';
import { useTranslation } from 'react-i18next';
import PrimaryButton from './PrimaryButton';

interface GroupBannerProps extends Omit<BoxProps, 'component'> {
    group: Group;
    height?: number | string;
    isGroupCreator?: boolean;
}

export default function GroupBanner({ group, height = 200, sx = {}, isGroupCreator = false, ...props }: GroupBannerProps) {
    const { t } = useTranslation();
    return (
        <Box
            component="div"
            sx={{
                width: '100%',
                height: height,
                backgroundImage: group.banner_image_path
                    ? `url(/storage/${group.banner_image_path})`
                    : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 1,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: group.banner_image_path
                    ? undefined
                    : 'transparent',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                ...sx
            }}
            {...props}
        >
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', p: 3, justifyContent: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    <GroupAvatar group={group} size={60} sx={{ mr: 2 }} />
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ color: '#ffffff' }}>
                            {group.name}
                        </Typography>
                        {group.description && (
                            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {group.description}
                            </Typography>
                        )}
                    </Box>
                    
                </Box>
                {isGroupCreator && (
                        <PrimaryButton
                            component={Link}
                            href={route('groups.edit', group.id)}
                            className='max-w-fit px-4'
                            color="primary"
                            title={t('common.edit')}
                            startIcon={<EditIcon sx={{ ml: 1}} />}
                        >
                            {t('common.edit')}
                        </PrimaryButton>
                    )}
            </Box>
        </Box>
    );
}
