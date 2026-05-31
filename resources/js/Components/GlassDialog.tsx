import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';

/**
 * GlassDialog Component
 * 
 * A reusable Dialog component with consistent glassmorphism styling for dark mode.
 * Provides a unified design system for all modal dialogs throughout the application.
 * 
 * @param {Object} props - All standard Dialog props plus custom styling options
 * @param {boolean} props.open - Whether the dialog is open
 * @param {function} props.onClose - Function to call when dialog should close
 * @param {string} props.title - Dialog title text
 * @param {React.ReactNode} props.children - Dialog content
 * @param {React.ReactNode} props.actions - Dialog action buttons
 * @param {string} props.maxWidth - Maximum width of the dialog (xs, sm, md, lg, xl)
 * @param {boolean} props.fullWidth - Whether dialog should take full width
 * @param {Object} props.PaperProps - Additional props for the Paper component
 * @param {...Object} rest - All other Dialog props
 */
const GlassDialog = ({
    open = false,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    PaperProps = {},
    ...rest
}) => {
    const theme = useTheme();

    const glassDialogPaperProps = {
        ...PaperProps,
        sx: {
            background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(3, 7, 18, 0.98) 100%)' 
                : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(15px)',
            border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(96, 165, 250, 0.4)' 
                : '1px solid rgba(20, 20, 20, 0.08)',
            borderRadius: '28px',
            boxShadow: theme.palette.mode === 'dark' 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(96, 165, 250, 0.4), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)' 
                : '0 24px 50px rgba(0, 0, 0, 0.12)',
            ...(PaperProps.sx || {})
        }
    };

    const backdropProps = {
        sx: {
            backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(107, 114, 128, 0.75)',
            backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={glassDialogPaperProps}
            BackdropProps={backdropProps}
            {...rest}
        >
            {title && (
                <DialogTitle sx={{ 
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                    fontWeight: 600 
                }}>
                    {title}
                </DialogTitle>
            )}
            
            {children && (
                <DialogContent sx={{ 
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'text.primary' 
                }}>
                    {children}
                </DialogContent>
            )}
            
            {actions && (
                <DialogActions sx={{ 
                    px: 3, 
                    pb: 3,
                    '& .MuiButton-root': {
                        color: theme.palette.mode === 'dark' ? 'white' : 'primary.main'
                    }
                }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default GlassDialog;
