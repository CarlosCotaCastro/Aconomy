import { useForm, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Group as GroupIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPaper from '@/Components/GlassPaper';
import GroupAvatar from '@/Components/GroupAvatar';
import GroupBanner from '@/Components/GroupBanner';
import { useTranslation } from 'react-i18next';
import GroupMemberList from "@/Pages/Groups/Partials/GroupMemberList";
import RecentItemsGrid from "@/Pages/Groups/Partials/RecentItemsGrid.jsx";

export default function Show({group, recentItems, auth, isGroupCreator}) {
    const { t } = useTranslation();
    const theme = useTheme();
    const {post, processing} = useForm();
    const {post: joinGroup, processing: joining} = useForm();
    const {delete: leaveGroup, processing: leaving} = useForm();

    const approvedMembers = group.users.filter(user => user.pivot.approved);
    const pendingMembers = group.users.filter(user => !user.pivot.approved);
    const isUserApproved = group.users.find(u => u.id === auth.user.id)?.pivot.approved;

    const handleApproveUser = (userId) => {
        post(route('groups.approve', [group.id, userId]));
    };

    const handleJoinGroup = () => {
        joinGroup(route('groups.join', group.id), {
            onError: (errors) => {
                if (errors.status === 419) {
                    window.location.reload();
                }
            },
        });
    };

    const handleLeaveGroup = () => {
        leaveGroup(route('groups.leave', group.id), {
            onError: (errors) => {
                if (errors.status === 419) {
                    window.location.reload();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{mb: 4}}>
                <Button
                    component={Link}
                    href={route('groups.index')}
                    startIcon={<ArrowBackIcon/>}
                    sx={{mb: 2}}
                >
                    {t('groups.backToGroups')}
                </Button>

                {/* Group Banner */}
                <GroupBanner
                    group={group}
                    height={200}
                    sx={{ mb: 3 }}
                    isGroupCreator={isGroupCreator}
                />
                
            </Box>

            <Grid container spacing={3}>
                <Grid size={3}>
                    <GroupMemberList
                        approvedMembers={approvedMembers}
                    />

                    {isUserApproved && pendingMembers.length > 0 && (
                        <GlassPaper>
                                <Typography variant="h6" gutterBottom>
                                    {t('groups.pendingRequestsTitle', { count: pendingMembers.length })}
                                </Typography>
                                <Divider sx={{mb: 2}}/>

                                <List>
                                    {pendingMembers.map(user => (
                                        <ListItem
                                            key={user.id}
                                            secondaryAction={
                                                <Box>
                                                    <IconButton
                                                        edge="end"
                                                        color="success"
                                                        onClick={() => handleApproveUser(user.id)}
                                                        disabled={processing}
                                                        title={t('groups.approveUser')}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={user.profile_image_path ? `/storage/${user.profile_image_path}` : undefined}
                                                    alt={user.name}
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.name}
                                                secondary={user.email}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                        </GlassPaper>
                    )}

                    {!isUserApproved && (
                        <GlassPaper>
                            <Typography variant="h6" gutterBottom>
                                {t('groups.joinGroup')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                {t('groups.joinGroupDescription')}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleJoinGroup}
                                disabled={joining}
                                fullWidth
                            >
                                {joining ? t('groups.joining') : t('groups.joinGroup')}
                            </Button>
                        </GlassPaper>
                    )}

                    {isUserApproved && (
                        <GlassPaper>
                            <Typography variant="h6" gutterBottom>
                                {t('groups.groupActions')}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleLeaveGroup}
                                disabled={leaving}
                                fullWidth
                            >
                                {leaving ? t('groups.leaving') : t('groups.leaveGroup')}
                            </Button>
                        </GlassPaper>
                    )}
                </Grid>

                <Grid size={9}>
                    <RecentItemsGrid
                        items={recentItems}
                        title={t('groups.recentItems')}
                        showOwner={true}
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
}
