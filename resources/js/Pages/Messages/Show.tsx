import { useEffect, useRef, useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    IconButton,
    InputBase,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPaper from '@/Components/GlassPaper';
import UserAvatar from '@/Components/UserAvatar.jsx';
import { lightTokens } from '@/lightTheme';
import { useConversationRealtime } from '@/hooks/useConversationRealtime';

function appendMessageIfNew(messages, incoming) {
    if (messages.some((m) => m.id === incoming.id)) {
        return messages;
    }

    return [...messages, incoming];
}

export default function Show({ conversation, messages: initialMessages = [], auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const bottomRef = useRef(null);

    const [messages, setMessages] = useState(initialMessages);
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [connectionError, setConnectionError] = useState(false);
    const [typingUser, setTypingUser] = useState(null);

    useEffect(() => {
        setMessages(initialMessages);
    }, [conversation.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, typingUser]);

    const { clearTypingIndicator } = useConversationRealtime({
        conversationId: conversation.id,
        currentUserId: auth.user.id,
        currentUserName: auth.user.name,
        body,
        onMessage: (message) => {
            setMessages((prev) => appendMessageIfNew(prev, message));
            setConnectionError(false);
        },
        onTyping: setTypingUser,
        onSubscriptionFailed: () => setConnectionError(true),
    });

    const submit = async (e) => {
        e.preventDefault();
        const trimmed = body.trim();
        if (!trimmed || sending) {
            return;
        }

        setSending(true);
        setSendError(null);
        clearTypingIndicator();

        try {
            const { data } = await window.axios.post(
                route('messages.store'),
                {
                    conversation_id: conversation.id,
                    body: trimmed,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );

            setMessages((prev) => appendMessageIfNew(prev, data.message));
            setBody('');
        } catch (error) {
            const message = error.response?.data?.message
                ?? error.response?.data?.errors?.body?.[0]
                ?? t('messages.sendFailed');
            setSendError(message);
        } finally {
            setSending(false);
        }
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={conversation.other.name} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <IconButton component={Link} href={route('messages.index')} aria-label={t('messages.backToMessages')}>
                    <ArrowBackIcon />
                </IconButton>
                <UserAvatar user={conversation.other} size={40} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{conversation.other.name}</Typography>
            </Box>

            <GlassPaper sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '64vh' }}>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {messages.length === 0 && (
                        <Box sx={{ m: 'auto', textAlign: 'center', color: 'text.secondary' }}>
                            <Typography>{t('messages.emptyThread')}</Typography>
                        </Box>
                    )}
                    {messages.map((message) => {
                        const mine = message.sender_id === auth.user.id;
                        return (
                            <Box
                                key={message.id}
                                sx={{
                                    alignSelf: mine ? 'flex-end' : 'flex-start',
                                    maxWidth: '78%',
                                }}
                            >
                                <Box
                                    sx={{
                                        px: 1.75,
                                        py: 1,
                                        borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        color: mine ? '#fff' : 'text.primary',
                                        background: mine
                                            ? lightTokens.orangeGradient
                                            : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,20,20,0.05)'),
                                    }}
                                >
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {message.body}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', textAlign: mine ? 'right' : 'left', mt: 0.25, px: 0.5 }}
                                >
                                    {format(parseISO(message.created_at), 'p')}
                                </Typography>
                            </Box>
                        );
                    })}
                    <div ref={bottomRef} />
                </Box>

                {connectionError && (
                    <Typography variant="caption" color="warning.main" sx={{ px: 2, pb: 0.5 }}>
                        {t('messages.connectionFailed')}
                    </Typography>
                )}

                {typingUser && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ px: 2, pb: 0.5, fontStyle: 'italic' }}
                    >
                        {t('messages.typing', { name: typingUser.name })}
                    </Typography>
                )}

                {sendError && (
                    <Typography variant="caption" color="error" sx={{ px: 2, pb: 0.5 }}>
                        {sendError}
                    </Typography>
                )}

                <Box
                    component="form"
                    onSubmit={submit}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${lightTokens.border}`,
                    }}
                >
                    <InputBase
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        onBlur={clearTypingIndicator}
                        placeholder={t('messages.typeMessage')}
                        fullWidth
                        multiline
                        maxRows={4}
                        disabled={sending}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: '18px',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${lightTokens.border}`,
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                submit(e);
                            }
                        }}
                    />
                    <IconButton type="submit" disabled={sending || !body.trim()} color="primary" aria-label={t('messages.send')}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </GlassPaper>
        </AuthenticatedLayout>
    );
}
