import { useEffect, useRef } from 'react';
import { getCsrfTokenFromMeta, syncCsrfToken } from '@/utils/csrf';

const TYPING_HIDE_MS = 3000;
const TYPING_DEBOUNCE_MS = 300;
const MESSAGE_EVENT = 'message.sent';

export function normalizeMessagePayload(payload: unknown): Record<string, unknown> | null {
    let data = payload;

    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch {
            return null;
        }
    }

    if (!data || typeof data !== 'object') {
        return null;
    }

    const record = data as Record<string, unknown>;

    if (typeof record.data === 'string') {
        try {
            const nested = JSON.parse(record.data);
            if (nested && typeof nested === 'object' && (nested as Record<string, unknown>).id) {
                return nested as Record<string, unknown>;
            }
        } catch {
            // ignore
        }
    }

    if (record.data && typeof record.data === 'object') {
        const nested = record.data as Record<string, unknown>;
        if (nested.id) {
            return nested;
        }
    }

    return record.id ? record : null;
}

type TypingPayload = { id: number; name: string };

type UseConversationRealtimeOptions = {
    conversationId: number;
    currentUserId: number;
    currentUserName: string;
    body: string;
    onMessage: (message: Record<string, unknown>) => void;
    onTyping: (user: TypingPayload | null) => void;
    onSubscriptionFailed?: () => void;
};

export function useConversationRealtime({
    conversationId,
    currentUserId,
    currentUserName,
    body,
    onMessage,
    onTyping,
    onSubscriptionFailed,
}: UseConversationRealtimeOptions) {
    const channelRef = useRef<ReturnType<typeof window.Echo.private> | null>(null);
    const typingHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onMessageRef = useRef(onMessage);
    const onTypingRef = useRef(onTyping);
    const onSubscriptionFailedRef = useRef(onSubscriptionFailed);

    onMessageRef.current = onMessage;
    onTypingRef.current = onTyping;
    onSubscriptionFailedRef.current = onSubscriptionFailed;

    const clearTypingIndicator = () => {
        if (typingHideTimerRef.current) {
            clearTimeout(typingHideTimerRef.current);
            typingHideTimerRef.current = null;
        }
        onTypingRef.current(null);
    };

    const showTypingFromOther = (payload: TypingPayload) => {
        if (!payload?.id || payload.id === currentUserId) {
            return;
        }

        onTypingRef.current({ id: payload.id, name: payload.name });

        if (typingHideTimerRef.current) {
            clearTimeout(typingHideTimerRef.current);
        }

        typingHideTimerRef.current = setTimeout(() => {
            onTypingRef.current(null);
            typingHideTimerRef.current = null;
        }, TYPING_HIDE_MS);
    };

    useEffect(() => {
        const echo = window.Echo;
        if (!echo) {
            console.warn('Laravel Echo is not available — live messages disabled.');
            onSubscriptionFailedRef.current?.();
            return undefined;
        }

        const channelName = `conversation.${conversationId}`;

        const handleMessage = (payload: unknown) => {
            const message = normalizeMessagePayload(payload);
            if (message) {
                onMessageRef.current(message);
                clearTypingIndicator();
            }
        };

        const subscribe = () => {
            const csrf = getCsrfTokenFromMeta();
            if (csrf) {
                syncCsrfToken(csrf);
            }

            if (channelRef.current) {
                channelRef.current.stopListening(`.${MESSAGE_EVENT}`);
                channelRef.current.stopListeningForWhisper('typing');
                echo.leave(channelName);
                channelRef.current = null;
            }

            const channel = echo.private(channelName);
            channelRef.current = channel;

            channel.listen(`.${MESSAGE_EVENT}`, handleMessage);
            channel.listenForWhisper('typing', showTypingFromOther);

            channel.error(() => {
                console.error('Failed to subscribe to', channelName);
                onSubscriptionFailedRef.current?.();
            });
        };

        subscribe();

        const connection = echo.connector?.pusher?.connection;
        const onConnected = () => subscribe();

        if (connection) {
            connection.bind('connected', onConnected);
        }

        return () => {
            if (connection) {
                connection.unbind('connected', onConnected);
            }

            if (channelRef.current) {
                channelRef.current.stopListening(`.${MESSAGE_EVENT}`);
                channelRef.current.stopListeningForWhisper('typing');
            }

            echo.leave(channelName);
            channelRef.current = null;
        };
    }, [conversationId, currentUserId]);

    useEffect(() => {
        if (typingDebounceRef.current) {
            clearTimeout(typingDebounceRef.current);
        }

        const trimmed = body.trim();
        if (!trimmed || !channelRef.current) {
            return undefined;
        }

        typingDebounceRef.current = setTimeout(() => {
            channelRef.current?.whisper('typing', {
                id: currentUserId,
                name: currentUserName,
            });
        }, TYPING_DEBOUNCE_MS);

        return () => {
            if (typingDebounceRef.current) {
                clearTimeout(typingDebounceRef.current);
            }
        };
    }, [body, currentUserId, currentUserName]);

    useEffect(() => () => {
        if (typingDebounceRef.current) {
            clearTimeout(typingDebounceRef.current);
        }
        if (typingHideTimerRef.current) {
            clearTimeout(typingHideTimerRef.current);
        }
    }, []);

    return { clearTypingIndicator };
}
