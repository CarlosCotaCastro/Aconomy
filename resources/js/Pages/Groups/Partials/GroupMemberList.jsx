import {
    Avatar,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@mui/material";
import {Person as PersonIcon} from "@mui/icons-material";
import {useState} from "react";

export default function GroupMemberList({approvedMembers}) {

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Members ({approvedMembers.length})
                </Typography>
                <Divider sx={{mb: 2}}/>

                <List>
                    {approvedMembers.map(user => (
                        <ListItem key={user.id}>
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
                    {approvedMembers.length === 0 && (
                        <Typography color="text.secondary">
                            No members in this group yet.
                        </Typography>
                    )}
                </List>
            </CardContent>
        </Card>
    );
}
