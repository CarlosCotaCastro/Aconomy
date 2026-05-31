import { differenceInCalendarDays, format, parseISO } from 'date-fns';

export type DueSeverity = 'overdue' | 'soon' | 'normal';

export interface DueInfo {
    date: Date;
    days: number;
    severity: DueSeverity;
    /** translation key under the `dashboard` namespace for relative wording */
    relativeKey: 'overdue' | 'dueToday' | 'dueTomorrow' | 'dueOn';
    formatted: string;
}

/**
 * Derive display info for a due date. Returns null when no date is set.
 */
export function dueInfo(dueAt?: string | Date | null): DueInfo | null {
    if (!dueAt) {
        return null;
    }

    const date = typeof dueAt === 'string' ? parseISO(dueAt) : dueAt;

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const days = differenceInCalendarDays(date, new Date());

    let severity: DueSeverity = 'normal';
    let relativeKey: DueInfo['relativeKey'] = 'dueOn';

    if (days < 0) {
        severity = 'overdue';
        relativeKey = 'overdue';
    } else if (days === 0) {
        severity = 'soon';
        relativeKey = 'dueToday';
    } else if (days === 1) {
        severity = 'soon';
        relativeKey = 'dueTomorrow';
    }

    return {
        date,
        days,
        severity,
        relativeKey,
        formatted: format(date, 'PP'),
    };
}
