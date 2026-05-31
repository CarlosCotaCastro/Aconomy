/**
 * Warm "Progressive Sharing" light design system tokens.
 *
 * Single source of truth for the light theme. Reuse these values anywhere a
 * `theme.palette.mode === 'dark' ? <dark> : <light>` branch needs light styling
 * so the light look stays consistent across the app. Never apply these to the
 * dark branch.
 */
export const lightTokens = {
    bg: '#f8f4ee',
    bg2: '#efe7dc',
    surface: 'rgba(255,255,255,0.74)',
    surfaceSolid: '#ffffff',
    border: 'rgba(20,20,20,0.08)',
    text: '#171717',
    muted: '#66645f',
    orange1: '#ffb36b',
    orange2: '#ff8a4c',
    orange3: '#ff784f',
    indigo: '#5b6cff',
    lavender: '#9d7dff',
    green: '#7eb487',
    rose: '#ff7fa8',
    yellow: '#f1c15f',
    shadow: '0 18px 40px rgba(0,0,0,0.08)',
    hoverShadow: '0 24px 50px rgba(0,0,0,0.12)',
    orangeGradient: 'linear-gradient(135deg, #ffb36b 0%, #ff8a4c 55%, #ff784f 100%)',
    pageGradient:
        'radial-gradient(circle at top left, rgba(91,108,255,0.12), transparent 24%),' +
        'radial-gradient(circle at bottom right, rgba(255,147,106,0.14), transparent 24%),' +
        'linear-gradient(180deg, #f8f4ee 0%, #efe7dc 100%)',
} as const;

export type LightTokens = typeof lightTokens;
