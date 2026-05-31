import { Button, useTheme } from "@mui/material";

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    const theme = useTheme();

    return (
        <Button
            component={props.href ? 'a' : 'button'}
            {...props}
            type={type}
            variant="outlined"
            className={className}
            sx={{
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(20, 20, 20, 0.08)'}`,
                backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                color: theme.palette.mode === 'dark' 
                    ? theme.palette.grey[300] 
                    : theme.palette.text.primary,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '8px 16px',
                borderRadius: theme.palette.mode === 'dark' ? '6px' : '18px',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.85)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(20, 20, 20, 0.16)'}`,
                },
                '&:focus': {
                    outline: 'none',
                    ring: 2,
                    ringColor: theme.palette.primary.main,
                    ringOffset: 2,
                },
                '&:disabled': {
                    opacity: 0.25,
                },
                ...props.sx
            }}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
