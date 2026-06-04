/**
 * Laravel pivot booleans are often serialized as 0/1 in Inertia props.
 * Use this instead of raw pivot values in JSX (`{value && <X />}` renders "0").
 */
export function isPivotApproved(approved: unknown): boolean {
    return approved === true || approved === 1;
}
