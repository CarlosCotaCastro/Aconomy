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

export default function Show({group, auth}) {
    const {post, processing} = useForm();

    const approvedMembers = group.users.filter(user => user.pivot.approved);
    const pendingMembers = group.users.filter(user => !user.pivot.approved);
    const isUserApproved = group.users.find(u => u.id === auth.user.id)?.pivot.approved;

    const handleApproveUser = (userId) => {
        post(route('groups.approve', [group.id, userId]));
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
                    Back to Groups
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
                <Grid item size={{md: 3}}>
                    <GroupMemberList
                        approvedMembers={approvedMembers}
                    />


                    {isUserApproved && pendingMembers.length > 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Pending Requests ({pendingMembers.length})
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


            {/* Search Component */}
            {isUserApproved && (
                <Grid item size={{md: 9}}>
                    <GroupItemSearch group={group} userId={auth.user.id} isUserApproved={isUserApproved}/>
                </Grid>
            )}

            </Grid>


            {group.users.find(u => u.id === auth.user.id) ? (
                <Box sx={{mt: 3}}>
                    <Button
                        component={Link}
                        href={route('groups.leave', group.id)}
                        method="delete"
                        as="button"
                        variant="outlined"
                        color="error"
                    >
                        Leave Group
                    </Button>
                </Box>
            ) : (
                <Box sx={{mt: 3}}>
                    <Button
                        component={Link}
                        href={route('groups.join', group.id)}
                        method="post"
                        as="button"
                        variant="contained"
                    >
                        Join Group
                    </Button>
                </Box>
            )}
        </AuthenticatedLayout>
    );
}
