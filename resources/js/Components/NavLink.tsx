import { Link } from '@inertiajs/react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const StyledNavLink = styled(Link)(({ theme, active }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    borderBottom: '2px solid',
    borderBottomColor: active 
        ? theme.palette.primary.main 
        : 'transparent',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.25,
    transition: 'all 150ms ease-in-out',
    textDecoration: 'none',
    color: active 
        ? (theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main)
        : (theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.secondary),
    
    '&:hover': {
        borderBottomColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.3)' 
            : theme.palette.grey[300],
        color: theme.palette.mode === 'dark' 
            ? theme.palette.text.primary 
            : theme.palette.text.primary,
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.04)',
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
        borderRadius: '8px 8px 0 0',
    },
    
    '&:focus': {
        outline: 'none',
        borderBottomColor: active 
            ? (theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark)
            : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.grey[300]),
        color: theme.palette.mode === 'dark' 
            ? theme.palette.text.primary 
            : theme.palette.text.primary,
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.04)',
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
        borderRadius: '8px 8px 0 0',
    }
}));

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    const theme = useTheme();
    
    return (
        <StyledNavLink
            {...props}
            theme={theme}
            active={active}
            className={className}
        >
            {children}
        </StyledNavLink>
    );
}
