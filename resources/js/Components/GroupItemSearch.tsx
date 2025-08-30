import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import GroupItemSearchUnavailable from './GroupItemSearchUnavailable.jsx';
import ItemCard from './ItemCard.jsx';
import { InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { useTheme } from '@mui/material/styles';

export default function GroupItemSearch({ isApprovedMember, rounded = false }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const debounceRef = useRef();

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await axios.get('/search/group-items', { params: { q: query } });
                setResults(data.items);
            } catch (err) {
                setError('Error fetching items.');
            }
            setLoading(false);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const requestBorrow = async (itemId) => {
        setError(null);
        setSuccess(null);

        console.info(`Requesting borrow for item ID: ${itemId}`);
        try {
            router.get('/borrow-requests/create/', { item: itemId });
        } catch (err) {
            setError('Could not send borrow request.');
        }
    };

        if (!isApprovedMember) {
        return <GroupItemSearchUnavailable />;
    }

    console.log(rounded);

    return (
        <div className="py-4">
            <InputBase
                type="input"
                sx={{
                    borderRadius: rounded ? "9999px" : "8px",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.1)",
                    padding: "10px 16px",
                    fontSize: "26px",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    color: isDark ? "#ffffff" : "#000000",
                    boxShadow: isDark 
                        ? "0 8px 32px rgba(0, 0, 0, 0.3)" 
                        : "0 8px 32px rgba(0, 0, 0, 0.1)",
                    '& .MuiInputBase-input::placeholder': {
                        color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    }
                }}
                value={query}
                startAdornment={<Search sx={{ fontSize: "26px", mr: 1, color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }} />}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('groupItemSearch.searchPlaceholder')}
                className={`mb-4 w-full p-4 text-3xl shadow-lg ${rounded ? "rounded-full" : "rounded"}`}
            />

            {loading && <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading...</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(item => (
                    <ItemCard 
                        key={item.id}
                        item={item}
                        onRequestBorrow={requestBorrow}
                        buttonText="Request to Borrow"
                    />
                ))}
            </div>
        </div>
    );
} 