import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

export default function GroupItemSearchUnavailable() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ py: 3 }}>
            <Paper 
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    background: isDark 
                        ? 'rgba(255, 255, 255, 0.02)' 
                        : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    backdropFilter: isDark ? 'blur(10px)' : 'none',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'
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
            </Paper>
        </Box>
    );
} 