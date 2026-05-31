import React from 'react';
import { useTheme } from '@mui/material/styles';
import UserAvatar from './UserAvatar.jsx';
import SecondaryButton from './SecondaryButton.jsx';

export default function ItemCard({ item, onRequestBorrow, buttonText = "Request to Borrow" }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <div className={`border p-4 flex flex-col items-center transition-all duration-300 ${
            isDark 
                ? 'rounded bg-gray-800/20 backdrop-blur-md border-gray-700/30 hover:bg-gray-800/40 shadow-lg hover:shadow-xl' 
                : 'rounded-[28px] bg-white/[0.78] backdrop-blur-md border-black/[0.06] shadow-[0_18px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1.5'
        }`}>
            <img 
                src={item.image || '/placeholder.png'} 
                alt={item.name} 
                className="w-32 h-32 object-cover mb-2 rounded-2xl shadow-md" 
            />
            <div className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-[#171717]'}`}>
                {item.name}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#66645f]'}`}>
                Status: {item.status}
            </div>
            <div className="flex items-center my-4">
                <UserAvatar 
                    user={item.owner}
                    size={32}
                    sx={{ mr: 1 }}
                />
                <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-[#171717]'}`}>
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
