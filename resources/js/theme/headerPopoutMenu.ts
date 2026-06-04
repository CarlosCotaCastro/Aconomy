import type { MenuProps } from '@mui/material/Menu';

/**
 * Shared popout styling for header menus (language, notifications, account).
 * Matches the LanguageSwitcher defaults: theme border radius, no extra top gap.
 */
export const headerPopoutMenuProps: Pick<MenuProps, 'slotProps'> = {
    slotProps: {
        paper: {
            elevation: 2,
        },
    },
};
