import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, router, usePage } from '@inertiajs/react';
import { useTheme } from '@mui/material/styles';
import { User } from '@/types';

// Declare global route function
declare global {
    function route(name: string, params?: any): string;
}

interface ProfileImageUploadProps {
    user: User;
    className?: string;
}

export default function ProfileImageUpload({ user, className = '' }: ProfileImageUploadProps) {
    const [imgSrc, setImgSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [showCrop, setShowCrop] = useState(false);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { data, setData, post, processing, errors, reset } = useForm({
        image: null as File | null,
        crop: null as PixelCrop | null,
    });

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setShowCrop(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                1,
                width,
                height
            ),
            width,
            height
        );
        setCrop(crop);
    }

    async function onCropComplete() {
        if (!imgRef.current || !completedCrop) return null;

        try {
            const image = imgRef.current;
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;

            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width,
                completedCrop.height
            );

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                }, 'image/jpeg', 0.95);
            });
            const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });

            return {
                image: file,
                crop: completedCrop,
            };
        } catch (error) {
            console.error('Error processing image:', error);
            return null;
        }
    }

    function submitWithImageData(imageData: { image: File; crop: PixelCrop }) {
        if (!imageData || !imageData.image) {
            console.error('No image data available');
            return;
        }

        // Only send the image file, not the crop data (backend doesn't need it)
        router.post(route('profile.update-image'), {
            image: imageData.image
        }, {
            onSuccess: () => {
                setShowCrop(false);
                setImgSrc('');
                reset();
            },
            onError: (errors: any) => {
                console.error('Error uploading image:', errors);
            },
        });
    }

    return (
        <div className={className}>
            <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full">
                    {user.profile_image_path ? (
                        <img
                            src={`/storage/${user.profile_image_path}`}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className={`flex h-full w-full items-center justify-center ${isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-400'}`}>
                            <svg
                                className="h-12 w-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="profile_image" value="Profile Image" color="" children={null} />
                    <input
                        type="file"
                        id="profile_image"
                        accept="image/*"
                        onChange={onSelectFile}
                        className={`mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
                            isDark 
                                ? 'text-gray-300 file:bg-violet-900/50 file:text-violet-300 hover:file:bg-violet-800/50' 
                                : 'text-gray-500 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'
                        }`}
                    />
                    <InputError message={errors.image} className="mt-2" />
                </div>
            </div>

            {showCrop && createPortal(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" style={{ zIndex: 9999 }}>
                    <div className={`w-full max-w-lg rounded-lg p-6 ${
                        isDark 
                            ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50' 
                            : 'bg-white'
                    }`}>
                        <h3 className={`mb-4 text-lg font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            Crop Profile Image
                        </h3>
                        <div className="mb-4">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                            >
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    alt="Crop me"
                                    className="max-h-[60vh] w-auto"
                                />
                            </ReactCrop>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCrop(false);
                                    setImgSrc('');
                                }}
                                className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset transition duration-150 ease-in-out ${
                                    isDark 
                                        ? 'bg-gray-700/50 text-gray-200 ring-gray-600 hover:bg-gray-600/50' 
                                        : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                Cancel
                            </button>
                            <PrimaryButton
                                onClick={async () => {
                                    try {
                                        const imageData = await onCropComplete();
                                        if (imageData && imageData.image) {
                                            submitWithImageData(imageData);
                                        }
                                    } catch (error) {
                                        console.error('Error saving image:', error);
                                    }
                                }}
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
} 