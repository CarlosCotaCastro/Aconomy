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
import { useTranslation } from 'react-i18next';

export default function GroupMemberList({approvedMembers}) {
    const { t } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('groups.membersTitle', { count: approvedMembers.length })}
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
                            {t('groups.noMembers')}
                        </Typography>
                    )}
                </List>
            </CardContent>
        </Card>
    );
}
