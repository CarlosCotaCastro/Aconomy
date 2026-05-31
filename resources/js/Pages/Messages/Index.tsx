import { Link, Head } from '@inertiajs/react';
import { Box, Typography, Badge, Divider, useTheme } from '@mui/material';
import { ChatBubbleOutline as MessageIcon } from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPaper from '@/Components/GlassPaper';
import UserAvatar from '@/Components/UserAvatar.jsx';

export default function Index({ conversations = [], auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('messages.title')} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                {t('messages.title')}
            </Typography>

            <GlassPaper sx={{ p: 0, overflow: 'hidden' }}>
                {conversations.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, px: 2, color: 'text.secondary' }}>
                        <MessageIcon sx={{ fontSize: 48, opacity: 0.4, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{t('messages.noConversations')}</Typography>
                        <Typography variant="body2">{t('messages.noConversationsHint')}</Typography>
                    </Box>
                ) : (
                    conversations.map((conversation, idx) => (
                        <Box key={conversation.id}>
                            {idx > 0 && <Divider />}
                            <Box
                                component={Link}
                                href={route('messages.show', conversation.id)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(20,20,20,0.03)' },
                                }}
                            >
                                <UserAvatar user={conversation.other} size={48} />
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                        <Typography sx={{ fontWeight: conversation.unread_count ? 700 : 600 }} noWrap>
                                            {conversation.other.name}
                                        </Typography>
                                        {conversation.last_message_at && (
                                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                                {formatDistanceToNow(parseISO(conversation.last_message_at), { addSuffix: true })}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                        sx={{ fontWeight: conversation.unread_count ? 600 : 400 }}
                                    >
                                        {conversation.last_message
                                            ? `${conversation.last_message.from_me ? t('messages.you') + ': ' : ''}${conversation.last_message.body}`
                                            : t('messages.emptyThread')}
                                    </Typography>
                                </Box>
                                {conversation.unread_count > 0 && (
                                    <Badge badgeContent={conversation.unread_count} color="error" sx={{ mr: 1.5 }} />
                                )}
                            </Box>
                        </Box>
                    ))
                )}
            </GlassPaper>
        </AuthenticatedLayout>
    );
}
