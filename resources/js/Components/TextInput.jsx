import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const darkModeClasses = isDark 
        ? 'bg-white/[0.02] border-white/10 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm'
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <input
            {...props}
            type={type}
            className={
                `rounded-md shadow-sm transition-colors duration-200 ${darkModeClasses} ` +
                className
            }
            ref={localRef}
        />
    );
});
