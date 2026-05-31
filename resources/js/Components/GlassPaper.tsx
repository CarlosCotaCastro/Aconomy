import React from 'react';
import { Paper, useTheme } from '@mui/material';

/**
 * GlassPaper Component
 * 
 * A reusable Paper component with consistent glassmorphism styling for dark mode.
 * Provides a unified design system for all content containers throughout the application.
 * 
 * @param {Object} props - All standard Paper props plus custom styling options
 * @param {Object} props.sx - Additional sx props to extend the default styling
 * @param {number} props.elevation - Paper elevation (defaults to 0 for flat design)
 * @param {React.ReactNode} props.children - Content to be rendered inside the paper
 * @param {...Object} rest - All other Paper props
 */
const GlassPaper = ({ 
    sx = {}, 
    elevation = 0, 
    children, 
    ...rest 
}) => {
    const theme = useTheme();

    const glassStyle = {
        p: 3, // Default padding
        borderRadius: theme.palette.mode === 'dark' ? undefined : '28px',
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.02)' 
            : 'rgba(255, 255, 255, 0.74)',
        backdropFilter: 'blur(10px)',
        border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(20, 20, 20, 0.08)',
        boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
            : '0 18px 40px rgba(0, 0, 0, 0.08)',
        ...sx // Allow custom sx to override defaults
    };

    return (
        <Paper 
            elevation={elevation}
            sx={glassStyle}
            {...rest}
        >
            {children}
        </Paper>
    );
};

export default GlassPaper;
