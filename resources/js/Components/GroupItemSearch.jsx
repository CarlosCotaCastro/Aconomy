import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import GroupItemSearchUnavailable from './GroupItemSearchUnavailable.jsx';

export default function GroupItemSearch({ isApprovedMember }) {
    const { t } = useTranslation();
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
        try {
            await axios.post('/borrow-requests', { item_id: itemId });
            setSuccess('Borrow request sent!');
        } catch (err) {
            setError('Could not send borrow request.');
        }
    };

        if (!isApprovedMember) {
        return <GroupItemSearchUnavailable />;
    }

    return (
        <div className="py-4">
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t('groupItemSearch.searchPlaceholder')}
                    className="border rounded px-2 py-1 flex-1"
                />
            </div>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(item => (
                    <div key={item.id} className="border rounded p-4 flex flex-col items-center bg-white shadow">
                        <img src={item.image || '/default-item.png'} alt={item.name} className="w-32 h-32 object-cover mb-2 rounded" />
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className="text-gray-600">Status: {item.status}</div>
                        <div className="flex items-center mt-2">
                            <img src={item.owner.avatar || '/default-avatar.png'} alt={item.owner.name} className="w-8 h-8 rounded-full mr-2 border" />
                            <span>{item.owner.name}</span>
                        </div>
                        <button
                            className="mt-3 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => requestBorrow(item.id)}
                        >
                            Request to Borrow
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 