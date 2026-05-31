import React from 'react';
import { Box, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import GlassPaper from '@/Components/GlassPaper';
import { lightTokens } from '@/lightTheme';

export default function GroupItemSearchUnavailable() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ py: 3 }}>
            <GlassPaper 
                sx={{
                    p: 4,
                    textAlign: 'center',
                    background: isDark 
                        ? 'rgba(255, 255, 255, 0.02)' 
                        : lightTokens.pageGradient,
                }}
            >
                <img src="/group.png" className="max-h-48 mx-auto" />
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 1,
                        color: isDark ? '#ffffff' : 'text.primary',
                        fontWeight: 600
                    }}
                >
                    {t('groupItemSearch.joinGroupToUseSearch')}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                        maxWidth: 400,
                        mx: 'auto',
                        lineHeight: 1.6
                    }}
                >
                    {t('groupItemSearch.notApprovedMessage')}
                </Typography>
            </GlassPaper>
        </Box>
    );
} 