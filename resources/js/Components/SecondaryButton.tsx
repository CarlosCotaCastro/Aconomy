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
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.grey[300]}`,
                backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : theme.palette.common.white,
                backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                color: theme.palette.mode === 'dark' 
                    ? theme.palette.grey[300] 
                    : theme.palette.grey[700],
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : theme.palette.grey[50],
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.grey[400]}`,
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
