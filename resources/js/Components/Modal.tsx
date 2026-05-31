import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useTheme } from '@mui/material/styles';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div 
                        className={`absolute inset-0 ${
                            isDark 
                                ? 'bg-black/80' 
                                : 'bg-gray-500/75'
                        }`}
                        style={{
                            backdropFilter: isDark ? 'blur(10px)' : 'none'
                        }}
                    />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`mb-6 transform overflow-hidden rounded-lg shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass} ${
                            isDark 
                                ? 'text-white' 
                                : 'bg-white text-gray-900'
                        }`}
                        style={{
                            background: isDark 
                                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(3, 7, 18, 0.98) 100%)' 
                                : 'rgba(255, 255, 255, 0.92)',
                            border: isDark ? 'none' : '1px solid rgba(20, 20, 20, 0.08)',
                            backdropFilter: 'blur(15px)',
                            borderRadius: '28px',
                            boxShadow: isDark 
                                ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(96, 165, 250, 0.4), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)' 
                                : '0 24px 50px rgba(0, 0, 0, 0.12)'
                        }}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
