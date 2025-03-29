import { Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Chip,
    IconButton,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Group as GroupIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ groups, auth }) {
    const { post, processing } = useForm();

    const handleJoinGroup = (groupId) => {
        post(route('groups.join', groupId));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Groups
                </Typography>
                <Button
                    component={Link}
                    href={route('groups.create')}
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Create Group
                </Button>
            </Box>

            <Grid container spacing={3}>
                {groups.map((group) => {
                    // Count approved and pending members
                    const approvedMembers = group.users.filter(u => u.pivot.approved).length;
                    const pendingMembers = group.users.filter(u => !u.pivot.approved).length;
                    const isUserInGroup = group.users.some(u => u.id === auth.user.id);
                    const isUserApproved = group.users.find(u => u.id === auth.user.id)?.pivot.approved;
                    
                    return (
                        <Grid md={4} sm={6} key={group.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <GroupIcon sx={{ mr: 1 }} />
                                        <Typography variant="h6" component="h2">
                                            {group.name}
                                        </Typography>
                                    </Box>
                                    {group.description && (
                                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                                            {group.description}
                                        </Typography>
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
                                    <Button
                                        component={Link}
                                        href={route('groups.show', group.id)}
                                        size="small"
                                    >
                                        View Details
                                    </Button>
                                    {isUserApproved && (
                                        <>
                                            <IconButton
                                                component={Link}
                                                href={route('groups.edit', group.id)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                href={route('groups.destroy', group.id)}
                                                method="delete"
                                                as="button"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                    {!isUserInGroup && (
                                        <Button
                                            onClick={() => handleJoinGroup(group.id)}
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
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </AuthenticatedLayout>
    );
} 