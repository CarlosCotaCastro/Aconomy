import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    InputBase,
    IconButton,
    Typography,
    CircularProgress,
    Chip,
    Fade,
    useTheme,
} from '@mui/material';
import {
    Search as SearchIcon,
    Close as CloseIcon,
    Inventory2 as ItemIcon,
    Group as GroupIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import UserAvatar from '@/Components/UserAvatar.jsx';
import { lightTokens } from '@/lightTheme';

const EMPTY = { items: [], groups: [], people: [] };

export default function GlobalSearchOverlay({ open, onClose }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef();
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
            setResults(EMPTY);
            setLoading(false);
        }
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }
        const onKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            return;
        }
        setLoading(true);
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await axios.get(route('search.global'), { params: { q: query } });
                setResults({
                    items: data.items || [],
                    groups: data.groups || [],
                    people: data.people || [],
                });
            } catch {
                setResults(EMPTY);
            }
            setLoading(false);
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [query, open]);

    const go = (url) => {
        onClose();
        router.visit(url);
    };

    if (!open) {
        return null;
    }

    const totalResults = results.items.length + results.groups.length + results.people.length;
    const hasQuery = query.trim().length > 0;

    const sectionHeader = (icon, label, count) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, mb: 1.5 }}>
            {icon}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.04em' }}>
                {label}
            </Typography>
            <Chip size="small" label={count} sx={{ height: 20, fontSize: '0.7rem' }} />
        </Box>
    );

    const rowSx = {
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.25,
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'background-color .15s ease',
        '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(20,20,20,0.04)' },
    };

    return (
        <Fade in={open}>
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: (theme) => theme.zIndex.modal + 2,
                    backgroundColor: isDark ? 'rgba(8,6,12,0.78)' : 'rgba(248,244,238,0.85)',
                    backdropFilter: 'blur(14px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    px: 2,
                    pt: { xs: 2, sm: 6 },
                    overflowY: 'auto',
                }}
                onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 760 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1.25,
                            borderRadius: '999px',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : lightTokens.surfaceSolid,
                            border: isDark ? '1px solid rgba(255,255,255,0.12)' : `1px solid ${lightTokens.border}`,
                            boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : lightTokens.shadow,
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                        <InputBase
                            inputRef={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('search.placeholder')}
                            sx={{ flexGrow: 1, fontSize: '1.15rem' }}
                        />
                        {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                        <IconButton onClick={onClose} aria-label={t('search.close')}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, pr: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {t('search.escToClose')}
                        </Typography>
                    </Box>

                    {!hasQuery && (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <SearchIcon sx={{ fontSize: 48, opacity: 0.4, mb: 1 }} />
                            <Typography>{t('search.startTyping')}</Typography>
                        </Box>
                    )}

                    {hasQuery && !loading && totalResults === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <Typography>{t('search.noResults', { query })}</Typography>
                        </Box>
                    )}

                    {hasQuery && (
                        <Box sx={{ pb: 6 }}>
                            {results.items.length > 0 && (
                                <>
                                    {sectionHeader(<ItemIcon fontSize="small" sx={{ color: lightTokens.indigo }} />, t('search.items'), results.items.length)}
                                    {results.items.map((item) => (
                                        <Box
                                            key={`i-${item.id}`}
                                            sx={rowSx}
                                            onClick={() => go(route('borrow-requests.create', { item: item.id }))}
                                        >
                                            <Box
                                                component="img"
                                                src={item.image || '/placeholder.png'}
                                                alt={item.name}
                                                sx={{ width: 44, height: 44, borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 600 }} noWrap>{item.name}</Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {item.owner?.name}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                size="small"
                                                label={item.available ? t('search.available') : t('search.unavailable')}
                                                color={item.available ? 'success' : 'default'}
                                                variant={item.available ? 'filled' : 'outlined'}
                                            />
                                        </Box>
                                    ))}
                                </>
                            )}

                            {results.groups.length > 0 && (
                                <>
                                    {sectionHeader(<GroupIcon fontSize="small" sx={{ color: lightTokens.orange2 }} />, t('search.groups'), results.groups.length)}
                                    {results.groups.map((group) => (
                                        <Box
                                            key={`g-${group.id}`}
                                            sx={rowSx}
                                            onClick={() => go(route('groups.show', group.id))}
                                        >
                                            <UserAvatar user={{ name: group.name, profile_image_path: group.avatar_image_path }} size={44} />
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 600 }} noWrap>{group.name}</Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {t('search.membersCount', { count: group.members_count })}
                                                </Typography>
                                            </Box>
                                            {group.is_member && <Chip size="small" label={t('search.member')} variant="outlined" />}
                                        </Box>
                                    ))}
                                </>
                            )}

                            {results.people.length > 0 && (
                                <>
                                    {sectionHeader(<PersonIcon fontSize="small" sx={{ color: lightTokens.lavender }} />, t('search.people'), results.people.length)}
                                    {results.people.map((person) => (
                                        <Box
                                            key={`p-${person.id}`}
                                            sx={rowSx}
                                            onClick={() => go(route('profile.show', person.id))}
                                        >
                                            <UserAvatar user={person} size={44} />
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 600 }} noWrap>{person.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {t('search.viewProfile')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Fade>
    );
}
