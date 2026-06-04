import {
    Box,
    Button,
    CardContent,
    CardActions,
    Grid,
    Chip,
    CardMedia,
    useTheme,
} from '@mui/material';

import {
    Person as PersonIcon,
} from '@mui/icons-material';

import GlassPaper from '@/Components/GlassPaper';
import GroupBanner from '@/Components/GroupBanner';
import { Link, useForm } from '@inertiajs/react';
import { isPivotApproved } from '@/utils/groupMembership';

export default function GroupTeaser({ group, user }: any) {
    // Count approved and pending members
    const approvedMembers = group.users.filter((u: any) => isPivotApproved(u.pivot.approved)).length;
    const pendingMembers = group.users.filter((u: any) => !isPivotApproved(u.pivot.approved)).length;
    const isUserInGroup = group.users.some((u: any) => u.id === user.id);
    const isUserApproved = isPivotApproved(
        group.users.find((u: any) => u.id === user.id)?.pivot.approved,
    );

    const theme = useTheme();

    const { post, processing } = useForm();

    const handleJoinGroup = (groupId: number) => {
        post(route('groups.join', groupId));
    };

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group.id}>
            <GlassPaper
                component={Link}
                href={route('groups.show', group.id)}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 0, // Override default padding for Card layout
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : theme.palette.background.paper,
                        borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.2)'
                            : theme.palette.primary.main,
                        transform: 'translateY(-2px)',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                            : `0 8px 32px ${theme.palette.primary.main}20`,
                    }
                }}
            >
                <CardMedia sx={{ height: 200, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <GroupBanner
                        group={group}
                        height={200}
                        sx={{ borderRadius: '8px 8px 0 0' }}
                    />
                </CardMedia>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                            icon={<PersonIcon />}
                            label={`${approvedMembers} approved member${approvedMembers !== 1 ? 's' : ''}`}
                            color="primary"
                            size="small"
                        />
                    </Box>
                    {pendingMembers > 0 && isUserApproved && (
                        <Chip
                            label={`${pendingMembers} pending request${pendingMembers !== 1 ? 's' : ''}`}
                            color="warning"
                            size="small"
                        />
                    )}
                </CardContent>
                <CardActions>
                    {!isUserInGroup && (
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleJoinGroup(group.id);
                            }}
                            disabled={processing}
                            variant="outlined"
                            size="small"
                        >
                            Join Group
                        </Button>
                    )}
                    {isUserInGroup && !isUserApproved && (
                        <Chip
                            label="Pending Approval"
                            color="warning"
                            size="small"
                        />
                    )}
                </CardActions>
            </GlassPaper>
        </Grid>
    );
}