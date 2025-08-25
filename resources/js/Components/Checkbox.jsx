import { useTheme } from '@mui/material/styles';

export default function Checkbox({ className = '', ...props }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const darkModeClasses = isDark 
        ? 'border-white/20 bg-white/[0.02] text-purple-400 focus:ring-purple-400/20 backdrop-blur-sm'
        : 'border-gray-300 text-indigo-600 focus:ring-indigo-500';
    
    return (
        <input
            {...props}
            type="checkbox"
            className={
                `rounded shadow-sm transition-colors duration-200 ${darkModeClasses} ` +
                className
            }
        />
    );
}
