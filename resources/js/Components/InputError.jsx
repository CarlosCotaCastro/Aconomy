import { useTheme } from '@mui/material/styles';

export default function InputError({ message, className = '', ...props }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const errorColor = isDark ? 'text-red-400' : 'text-red-600';
    
    return message ? (
        <p
            {...props}
            className={`text-sm transition-colors duration-200 ${errorColor} ` + className}
        >
            {message}
        </p>
    ) : null;
}
