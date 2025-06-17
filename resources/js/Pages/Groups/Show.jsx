import {Link, useForm} from '@inertiajs/react';
import axios from 'axios';
import {useState, useEffect, useCallback} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Paper,
    Grid,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Group as GroupIcon,
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Inventory as InventoryIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GroupMemberList from "@/Pages/Groups/Partials/GroupMemberList";
import GroupItemSearch from "@/Pages/Groups/Partials/GroupItemSearch.jsx";
import RecentItemsGrid from "@/Pages/Groups/Partials/RecentItemsGrid.jsx";
import { useTranslation } from 'react-i18next';

export default function Show({group, recentItems, auth}) {
    const { t } = useTranslation();
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

                <Box sx={{display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Avatar sx={{bgcolor: 'primary.light', mr: 2}}>
                            <GroupIcon/>
                        </Avatar>
                        <Typography variant="h4" component="h1">
                            {group.name}
                        </Typography>
                    </Box>
                </Box>

                {group.description && (
                    <Typography color="text.secondary" sx={{mb: 3}}>
                        {group.description}
                    </Typography>
                )}
            </Box>

            <Grid container spacing={3}>
                <Grid size={3}>
                    <GroupMemberList
                        approvedMembers={approvedMembers}
                    />

                    {isUserApproved && pendingMembers.length > 0 && (
                        <Card>
                            <CardContent>
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
                                                    >
                                                        <CheckIcon/>
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PersonIcon/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.name}
                                                secondary={user.email}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                <Grid size={9}>
                    {isUserApproved && (
                        <Box>
                            <GroupItemSearch 
                                group={group} 
                                userId={auth.user.id} 
                                isUserApproved={isUserApproved}
                            />
                            <Box sx={{ mt: 4 }}>
                                <RecentItemsGrid 
                                    items={recentItems} 
                                    currentUserId={auth.user.id}
                                />
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {group.users.find(u => u.id === auth.user.id) ? (
                <Box sx={{mt: 3}}>
                    <Button
                        onClick={handleLeaveGroup}
                        disabled={leaving}
                        variant="outlined"
                        color="error"
                    >
                        {t('groups.leaveGroup')}
                    </Button>
                </Box>
            ) : (
                <Box sx={{mt: 3}}>
                    <Button
                        onClick={handleJoinGroup}
                        disabled={joining}
                        variant="contained"
                    >
                        {t('groups.joinGroup')}
                    </Button>
                </Box>
            )}
        </AuthenticatedLayout>
    );
}
