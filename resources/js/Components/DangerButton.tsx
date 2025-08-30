import { Button, useTheme } from "@mui/material";

export default function DangerButton({
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
            variant="contained"
            className={className}
            sx={{
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                    backgroundColor: theme.palette.error.dark,
                },
                '&:focus': {
                    outline: 'none',
                    ring: 2,
                    ringColor: theme.palette.error.main,
                    ringOffset: 2,
                },
                '&:active': {
                    backgroundColor: theme.palette.error.dark,
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
