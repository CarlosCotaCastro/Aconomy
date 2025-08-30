import React from 'react';
import { useTheme } from '@mui/material/styles';
import UserAvatar from './UserAvatar.jsx';
import SecondaryButton from './SecondaryButton.jsx';

export default function ItemCard({ item, onRequestBorrow, buttonText = "Request to Borrow" }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <div className={`border rounded p-4 flex flex-col items-center shadow-lg transition-all duration-300 hover:shadow-xl ${
            isDark 
                ? 'bg-gray-800/20 backdrop-blur-md border-gray-700/30 hover:bg-gray-800/40' 
                : 'bg-white/30 backdrop-blur-md border-gray-200/50'
        }`}>
            <img 
                src={item.image || '/placeholder.png'} 
                alt={item.name} 
                className="w-32 h-32 object-cover mb-2 rounded shadow-md" 
            />
            <div className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {item.name}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Status: {item.status}
            </div>
            <div className="flex items-center my-4">
                <UserAvatar 
                    user={item.owner}
                    size={32}
                    sx={{ mr: 1 }}
                />
                <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {item.owner.name}
                </span>
            </div>
            <SecondaryButton
                onClick={() => onRequestBorrow(item.id)}
            >
                {buttonText}
            </SecondaryButton>
        </div>
    );
}
