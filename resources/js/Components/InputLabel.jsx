export default function InputLabel({
    value,
    className = '',
    children,
    color = 'text-gray-700',
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium ${color} ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
