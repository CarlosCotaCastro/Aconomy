import {Link, router, useForm} from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Chip,
    IconButton, Tooltip, CardMedia, useTheme, Pagination,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Group as GroupIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useEffect} from "react";

export default function Index({ groups, auth }) {
    const { post, processing } = useForm();

    const theme = useTheme();
    const handleJoinGroup = (groupId) => {
        post(route('groups.join', groupId));
    };

    const handlePageChange = (event, page) => {
        router.get(
            route(route().current()),
            { page: page },
            { preserveScroll: true, preserveState: true }
        );
    };

    useEffect(() => {
        console.log(groups);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Groups
                </Typography>
                <PrimaryButton
                    component={Link}
                    href={route('groups.create')}
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Create Group
                </PrimaryButton>
            </Box>

            <Grid container spacing={3}>
                {groups.data && groups.data.map((group) => {
                    // Count approved and pending members
                    const approvedMembers = group.users.filter(u => u.pivot.approved).length;
                    const pendingMembers = group.users.filter(u => !u.pivot.approved).length;
                    const isUserInGroup = group.users.some(u => u.id === auth.user.id);
                    const isUserApproved = group.users.find(u => u.id === auth.user.id)?.pivot.approved;

                    return (
                        <Grid size={{xs: 12}} key={group.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
                                <CardMedia sx={{
                                    display: 'flex',
                                    aspectRatio: 16/9,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.palette.background.paper,
                                    maxWidth: '15%'
                                }}>
                                    <GroupIcon  sx={{ fontSize: '4em' }} className={'m-4'} />
                                </CardMedia>
                                <CardContent sx={{ flex: 1, maxWidth: '60%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>

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
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={groups.last_page}
                    page={groups.current_page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </AuthenticatedLayout>
    );
}
