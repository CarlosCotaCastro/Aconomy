import { Link } from '@inertiajs/react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const StyledResponsiveNavLink = styled(Link)(({ theme, active }) => ({
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    borderLeft: '4px solid',
    borderLeftColor: active 
        ? theme.palette.primary.main 
        : 'transparent',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(4),
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'all 150ms ease-in-out',
    textDecoration: 'none',
    borderRadius: '0 20px 20px 0',
    margin: theme.spacing(0, 1),
    
    // Active state colors
    ...(active && {
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(187, 134, 252, 0.15)' // Using primary color with transparency
            : theme.palette.primary.light + '20', // Light mode active background
        color: theme.palette.mode === 'dark' 
            ? theme.palette.primary.light 
            : theme.palette.primary.dark,
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
    }),
    
    // Inactive state colors
    ...(!active && {
        color: theme.palette.mode === 'dark' 
            ? theme.palette.text.secondary 
            : theme.palette.text.secondary,
    }),
    
    '&:hover': {
        borderLeftColor: active 
            ? theme.palette.primary.main 
            : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.grey[300]),
        backgroundColor: active 
            ? (theme.palette.mode === 'dark' 
                ? 'rgba(187, 134, 252, 0.2)' 
                : theme.palette.primary.light + '30')
            : (theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.04)'),
        color: theme.palette.mode === 'dark' 
            ? (active ? theme.palette.primary.light : theme.palette.text.primary)
            : (active ? theme.palette.primary.dark : theme.palette.text.primary),
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
    },
    
    '&:focus': {
        outline: 'none',
        borderLeftColor: active 
            ? theme.palette.primary.main 
            : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.grey[300]),
        backgroundColor: active 
            ? (theme.palette.mode === 'dark' 
                ? 'rgba(187, 134, 252, 0.2)' 
                : theme.palette.primary.light + '30')
            : (theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.04)'),
        color: theme.palette.mode === 'dark' 
            ? (active ? theme.palette.primary.light : theme.palette.text.primary)
            : (active ? theme.palette.primary.dark : theme.palette.text.primary),
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
    }
}));

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    const theme = useTheme();
    
    return (
        <StyledResponsiveNavLink
            {...props}
            theme={theme}
            active={active}
            className={className}
        >
            {children}
        </StyledResponsiveNavLink>
    );
}
