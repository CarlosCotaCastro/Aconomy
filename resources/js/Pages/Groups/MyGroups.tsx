import { Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Chip,
    Tooltip, CardMedia, useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    Group as GroupIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GlassPaper from '@/Components/GlassPaper';

export default function Index({ groups, auth }: any) {
    const { post, processing } = useForm();

    const theme = useTheme();
    const handleJoinGroup = (groupId: number) => {
        post(route('groups.join', groupId));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    My Groups
                </Typography>
                <PrimaryButton
                    component={Link}
                    href={route('groups.create')}
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={false}
                >
                    Create Group
                </PrimaryButton>
            </Box>

            <Grid container spacing={3}>
                {groups && groups.map((group: any) => {
                    // Count approved and pending members
                    const approvedMembers = group.users.filter((u: any) => u.pivot.approved).length;
                    const pendingMembers = group.users.filter((u: any) => !u.pivot.approved).length;
                    const isUserInGroup = group.users.some((u: any) => u.id === auth.user.id);
                    const isUserApproved = group.users.find((u: any) => u.id === auth.user.id)?.pivot.approved;

                    return (
                        <Grid size={{xs: 12, sm: 6}} key={group.id}>
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
                                <CardMedia sx={{
                                    display: 'flex',
                                    aspectRatio: 16/9,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : theme.palette.background.paper,
                                }}>
                                    <GroupIcon  sx={{ fontSize: '4em' }} />
                                </CardMedia>
                                <CardContent>
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
