import { useEffect, useRef } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
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

export default function Show({ conversation, messages = [], auth }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const bottomRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        conversation_id: conversation.id,
        body: '',
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const submit = (e) => {
        e.preventDefault();
        if (!data.body.trim()) {
            return;
        }
        post(route('messages.store'), {
            preserveScroll: true,
            onSuccess: () => reset('body'),
        });
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
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder={t('messages.typeMessage')}
                        fullWidth
                        multiline
                        maxRows={4}
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
                    <IconButton type="submit" disabled={processing || !data.body.trim()} color="primary" aria-label={t('messages.send')}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </GlassPaper>
        </AuthenticatedLayout>
    );
}
