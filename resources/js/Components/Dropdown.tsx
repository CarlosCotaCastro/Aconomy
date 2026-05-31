import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = '',
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext);
    const theme = useTheme();

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    // Generate dynamic classes based on theme
    const isDark = theme.palette.mode === 'dark';
    const baseContentClasses = `py-1 ${isDark 
        ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50' 
        : 'bg-white/[0.92] backdrop-blur-md border border-black/[0.08]'
    }`;
    const ringClasses = isDark 
        ? 'ring-gray-700/50' 
        : 'ring-black ring-opacity-5';

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-2xl shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={`rounded-2xl ring-1 ${ringClasses} ${baseContentClasses} ${contentClasses}`}
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const baseClasses = `block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out focus:outline-none ${
        isDark 
            ? 'text-gray-200 hover:bg-gray-700/50 focus:bg-gray-700/50' 
            : 'text-[#171717] hover:bg-black/[0.04] focus:bg-black/[0.04]'
    }`;
    
    return (
        <Link
            {...props}
            className={`${baseClasses} ${className}`}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
