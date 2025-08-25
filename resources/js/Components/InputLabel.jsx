import { useTheme } from '@mui/material/styles';

export default function InputLabel({
    value,
    className = '',
    children,
    color,
    ...props
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    // Use provided color or default based on theme
    const textColor = color || (isDark ? 'text-gray-300' : 'text-gray-700');
    
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium transition-colors duration-200 ${textColor} ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
