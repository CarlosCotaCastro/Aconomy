import { Link } from '@inertiajs/react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import {
    Groups as GroupsIcon,
    AddBox as AddBoxIcon,
    TravelExplore as BrowseIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import GlassPaper from '@/Components/GlassPaper';
import { lightTokens } from '@/lightTheme';

export default function OnboardingEmptyState({ name, onBrowse = () => {} }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const steps = [
        {
            number: 1,
            icon: GroupsIcon,
            color: lightTokens.orange2,
            title: t('onboarding.step1Title'),
            desc: t('onboarding.step1Desc'),
            actions: [
                { label: t('onboarding.step1Cta'), href: route('groups.index'), variant: 'contained' },
                { label: t('onboarding.step1CtaAlt'), href: route('groups.create'), variant: 'text' },
            ],
        },
        {
            number: 2,
            icon: AddBoxIcon,
            color: lightTokens.indigo,
            title: t('onboarding.step2Title'),
            desc: t('onboarding.step2Desc'),
            actions: [{ label: t('onboarding.step2Cta'), href: route('items.create'), variant: 'contained' }],
        },
        {
            number: 3,
            icon: BrowseIcon,
            color: lightTokens.lavender,
            title: t('onboarding.step3Title'),
            desc: t('onboarding.step3Desc'),
            actions: [{ label: t('onboarding.step3Cta'), onClick: onBrowse, variant: 'text' }],
        },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {t('onboarding.welcome', { name })}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('onboarding.subtitle')}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                }}
            >
                {steps.map((step) => (
                    <GlassPaper key={step.number} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                color: step.color,
                                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(20,20,20,0.04)',
                            }}
                        >
                            <step.icon />
                        </Box>
                        <Typography variant="overline" color="text.secondary">
                            {t('onboarding.stepLabel', { number: step.number })}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                            {step.desc}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {step.actions.map((action) =>
                                action.href ? (
                                    <Button
                                        key={action.label}
                                        component={Link}
                                        href={action.href}
                                        variant={action.variant}
                                        sx={{ textTransform: 'none', borderRadius: '999px', fontWeight: 600 }}
                                    >
                                        {action.label}
                                    </Button>
                                ) : (
                                    <Button
                                        key={action.label}
                                        onClick={action.onClick}
                                        variant={action.variant}
                                        sx={{ textTransform: 'none', borderRadius: '999px', fontWeight: 600 }}
                                    >
                                        {action.label}
                                    </Button>
                                ),
                            )}
                        </Box>
                    </GlassPaper>
                ))}
            </Box>
        </Box>
    );
}
