import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function GroupItemSearchUnavailable() {
    const { t } = useTranslation();

    return (
        <Box sx={{ py: 3 }}>
            <Paper 
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '1px solid #e2e8f0'
                }}
            >
                <SearchIcon 
                    sx={{ 
                        fontSize: 48, 
                        color: 'text.secondary',
                        mb: 2,
                        opacity: 0.6
                    }} 
                />
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 1,
                        color: 'text.primary',
                        fontWeight: 600
                    }}
                >
                    {t('groupItemSearch.notApprovedTitle')}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: 'text.secondary',
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