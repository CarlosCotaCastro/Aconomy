import {Link} from '@inertiajs/react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Chip,
    Avatar,
    ListItemAvatar,
    IconButton,
    Divider, useTheme,
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    Group as GroupIcon,
    SwapHoriz as SwapHorizIcon,
    AddCircle as AddCircleIcon,
    ArrowForward as ArrowForwardIcon,
    Circle as CircleIcon,
    Person as PersonIcon, ChevronRight,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";


export default function Dashboard({items = [], groups = [], lendings = [], borrowings = [], auth}) {
    const activeLendings = lendings.filter(l => !l.returned_at);
    const activeBorrowings = borrowings.filter(l => !l.returned_at);

    const theme = useTheme();

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

    function stringAvatar(name) {
        const wordcount = name.split(' ').length;
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: (wordcount === 1)
                ? name[0].toUpperCase()

                :`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Card>
                <CardContent>
                    <Box sx={{mb: 4}}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                background: 'linear-gradient(90deg, #5271ff 0%, #4361ee 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Welcome back, {auth.user.name}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
                            Here's what's happening with your items and groups.
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 4}}>

                            <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                                <Avatar sx={{
                                    bgcolor: 'rgba(82, 113, 255, 0.1)',
                                    mr: 2,
                                    width: 48,
                                    height: 48
                                }}>
                                    <InventoryIcon sx={{color: '#5271ff'}}/>
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{fontWeight: 600}}>
                                        My Items
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {items.length} total items
                                    </Typography>
                                </Box>
                            </Box>

                                <Button
                                    component={Link}
                                    href={route('items.create')}
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AddCircleIcon/>}
                                    sx={{
                                        borderRadius: 2,
                                        p: 1,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Add New Item
                                </Button>

                            <Divider sx={{my: 2}}/>

                            <List sx={{mb: 2}}>
                                {items.slice(0, 3).map((item) => (
                                    <ListItem
                                        key={item.id}
                                        component={Link}
                                        href={route('items.show', item.id)}
                                        disablePadding
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderRadius: 2,
                                            textDecoration: 'none',
                                            color: 'inherit'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            {item.image_path && (
                                                <Avatar
                                                    src={`/storage/${item.image_path}`}
                                                    variant="rounded"
                                                    sx={{width: 40, height: 40}}
                                                />
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{fontWeight: 500}}>
                                                    {item.name}
                                                </Typography>
                                            }
                                            secondary={item.description}
                                        />
                                    </ListItem>
                                ))}

                                {items.length === 0 && (
                                    <Box sx={{textAlign: 'center', py: 2}}>
                                        <Typography variant="body2" color="text.secondary">
                                            No items yet. Add your first item!
                                        </Typography>
                                    </Box>
                                )}

                                {items.length > 3 && (
                                    <Box sx={{textAlign: 'right', mt: 2}}>
                                        <Button
                                            component={Link}
                                            href={route('items.index')}
                                            endIcon={<ChevronRight/>}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            View all {items.length} items
                                        </Button>
                                    </Box>
                                )}
                            </List>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>

                            <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                                <Avatar sx={{
                                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                                    mr: 2,
                                    width: 48,
                                    height: 48
                                }}>
                                    <GroupIcon sx={{color: '#ff9800'}}/>
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{fontWeight: 600}}>
                                        My Groups
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {groups.length} groups joined
                                    </Typography>
                                </Box>
                            </Box>


                                <Button
                                    component={Link}
                                    href={route('groups.create')}
                                    variant="outlined"
                                    color={'warning'}
                                    fullWidth
                                    startIcon={<AddCircleIcon/>}
                                    sx={{
                                        borderRadius: 2,
                                        p: 1,
                                        //background: 'linear-gradient(90deg, #ff9800 0%, #ed8936 100%)',
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Create New Group
                                </Button>

                            <Divider sx={{my: 2}}/>

                            <List sx={{mb: 2}}>
                                {groups && groups.slice(0, 3).map((group) => (
                                    <ListItem
                                        key={group.id}
                                        component={Link}
                                        href={route('groups.show', group.id)}
                                        disablePadding
                                        sx={{
                                            mb: 1,
                                            bgcolor: 'background.paper',
                                            borderRadius: 2,
                                            p: 1,
                                            textDecoration: 'none',
                                            color: 'inherit'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar {...stringAvatar(group.name)} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{fontWeight: 500}}>
                                                    {group.name}
                                                </Typography>
                                            }
                                            secondary={`${group.users.filter(u => u.pivot.approved).length} members`}
                                        />
                                        <Chip
                                            label={group.users.find(u => u.id === auth.user.id)?.pivot.approved ? 'Approved' : 'Pending'}
                                            color={group.users.find(u => u.id === auth.user.id)?.pivot.approved ? 'success' : 'default'}
                                            size="small"
                                            variant={'filled'}
                                            sx={{
                                                ml: 1,
                                                ...(group.users.find(u => u.id === auth.user.id)?.pivot.approved
                                                ? {color: theme.palette.common.white}
                                                : {})
                                            }}
                                        />
                                    </ListItem>
                                ))}

                                {groups.length === 0 && (
                                    <Box sx={{textAlign: 'center', py: 2}}>
                                        <Typography variant="body2" color="text.secondary">
                                            No groups yet. Create or join a group!
                                        </Typography>
                                    </Box>
                                )}

                                {groups.length > 3 && (
                                    <Box sx={{textAlign: 'right'}}>
                                        <Button
                                            component={Link}
                                            href={route('groups.index')}
                                            endIcon={<ChevronRight/>}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            View all {groups.length} groups
                                        </Button>
                                    </Box>
                                )}
                            </List>


                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>

                            <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                                <Avatar sx={{
                                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                                    mr: 2,
                                    width: 48,
                                    height: 48
                                }}>
                                    <SwapHorizIcon sx={{color: '#4caf50'}}/>
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{fontWeight: 600}}>
                                        Active Lendings
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {activeLendings.length + activeBorrowings.length} active items
                                    </Typography>
                                </Box>
                            </Box>

                                <Button
                                    component={Link}
                                    href={route('lendings.create')}
                                    variant="outlined"
                                    color={'secondary'}
                                    fullWidth
                                    startIcon={<AddCircleIcon/>}
                                    sx={{
                                        borderRadius: 2,
                                        p: 1,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Lend an Item
                                </Button>

                            <Divider sx={{my: 2}}/>

                            <List sx={{mb: 2}}>
                                {activeLendings.slice(0, 2).map((lending) => (
                                    <ListItem
                                        key={lending.id}
                                        component={Link}
                                        href={route('lendings.show', lending.id)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{bgcolor: 'rgba(76, 175, 80, 0.1)'}}>
                                                <PersonIcon sx={{color: '#4caf50'}}/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{fontWeight: 500}}>
                                                    {lending.item.name}
                                                </Typography>
                                            }
                                            secondary={`Borrowed by ${lending.borrower.name}`}
                                        />
                                        <Chip
                                            label="Lent"
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                color: '#4caf50'
                                            }}
                                        />
                                    </ListItem>
                                ))}

                                {activeBorrowings.slice(0, 2).map((lending) => (
                                    <ListItem
                                        key={lending.id}
                                        component={Link}
                                        href={route('lendings.show', lending.id)}
                                        disablePadding={true}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{bgcolor: 'rgba(139, 92, 246, 0.1)'}}>
                                                <PersonIcon sx={{color: '#8b5cf6'}}/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{fontWeight: 500}}>
                                                    {lending.item.name}
                                                </Typography>
                                            }
                                            secondary={`Borrowed from ${lending.lender.name}`}
                                        />
                                        <Chip
                                            label="Borrowed"
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                                color: '#8b5cf6'
                                            }}
                                        />
                                    </ListItem>
                                ))}

                                {activeLendings.length === 0 && activeBorrowings.length === 0 && (
                                    <Box sx={{textAlign: 'center', py: 2}}>
                                        <Typography variant="body2" color="text.secondary">
                                            No active lendings. Start lending your items!
                                        </Typography>
                                    </Box>
                                )}

                                {(activeLendings.length + activeBorrowings.length) > 4 && (
                                    <Box sx={{textAlign: 'right'}}>
                                        <Button
                                            component={Link}
                                            href={route('lendings.index')}
                                            endIcon={<ChevronRight/>}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            View all lendings
                                        </Button>
                                    </Box>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <PrimaryButton href={'#'} sx={{marginY: '1em'}}
                           startIcon={<AddCircleIcon/>}
            >
                Test
            </PrimaryButton>

        </AuthenticatedLayout>
    );
}
