import { Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Chip,
    Tooltip, useTheme,
    CardMedia,
} from '@mui/material';
import {
    Add as AddIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GlassPaper from '@/Components/GlassPaper';
import GroupBanner from '@/Components/GroupBanner';
import GroupAvatar from '@/Components/GroupAvatar';
import { useTranslation } from 'react-i18next';

export default function Index({ groups, auth }: any) {
    const { post, processing } = useForm();

    const theme = useTheme();
    const handleJoinGroup = (groupId: number) => {
        post(route('groups.join', groupId));
    };

    const { t } = useTranslation();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h2" component="h1">
                    My Groups
                </Typography>
                <Box>
                    <PrimaryButton
                        component={Link}
                        href={route('groups.create')}
                        variant="contained"
                        startIcon={<AddIcon />}
                        disabled={false}
                    >
                        {t('groups.createGroup')}
                    </PrimaryButton>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {groups && groups.map((group: any) => {
                    // Count approved and pending members
                    const approvedMembers = group.users.filter((u: any) => u.pivot.approved).length;
                    const pendingMembers = group.users.filter((u: any) => !u.pivot.approved).length;
                    const isUserInGroup = group.users.some((u: any) => u.id === auth.user.id);
                    const isUserApproved = group.users.find((u: any) => u.id === auth.user.id)?.pivot.approved;

                    return (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={group.id}>
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <GroupAvatar 
                                            group={group} 
                                            size={40}
                                            sx={{ mr: 2 }}
                                        />
                                        <Typography variant="h6" component="h2">
                                            {group.name}
                                        </Typography>
                                    </Box>
                                    {group.description && (
                                        <Tooltip title={group.description}>
                                        <Typography color="text.secondary" sx={{ mb: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {group.description}
                                        </Typography>
                                        </Tooltip>
                                    )}
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
                })}
            </Grid>
        </AuthenticatedLayout>
    );
}
