import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Language as LanguageIcon } from '@mui/icons-material';
import { headerPopoutMenuProps } from '@/theme/headerPopoutMenu';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        handleClose();
    };

    return (
        <>
            <Button
                color="inherit"
                onClick={handleClick}
                startIcon={<LanguageIcon />}
                sx={{ minWidth: 'auto', px: 1 }}
            >
                {languages.find(lang => lang.code === i18n.language)?.name || 'English'}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                {...headerPopoutMenuProps}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        selected={i18n.language === language.code}
                    >
                        {language.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
} 