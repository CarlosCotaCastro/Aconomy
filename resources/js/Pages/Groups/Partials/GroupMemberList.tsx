import {
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@mui/material";
import {useState} from "react";
import { useTranslation } from 'react-i18next';
import UserAvatar from '@/Components/UserAvatar';
import { lightTokens } from '@/lightTheme';

export default function GroupMemberList({approvedMembers}) {
    const { t } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <Card sx={{
            background: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.02)'
                : lightTokens.surface,
            backdropFilter: 'blur(10px)',
            border: (theme) => theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : `1px solid ${lightTokens.border}`,
            borderRadius: (theme) => theme.palette.mode === 'dark' ? undefined : '28px',
            boxShadow: (theme) => theme.palette.mode === 'dark' ? undefined : lightTokens.shadow,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('groups.membersTitle', { count: approvedMembers.length })}
                </Typography>
                <Divider sx={{
                    mb: 2,
                    borderColor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : lightTokens.border,
                }}/>

                <List>
                    {approvedMembers.map(user => (
                        <ListItem 
                            key={user.id}
                            sx={{
                                borderRadius: 1,
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(20, 20, 20, 0.04)',
                                }
                            }}
                        >
                            <ListItemAvatar>
                                <UserAvatar user={user} size={40} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.name}
                                secondary={user.email}
                                primaryTypographyProps={{
                                    color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'text.primary'
                                }}
                                secondaryTypographyProps={{
                                    color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : 'text.secondary'
                                }}
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
