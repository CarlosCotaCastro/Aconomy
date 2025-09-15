import React, { useState, useRef } from 'react';
import { 
    Box, 
    Button, 
    IconButton, 
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useForm, router } from '@inertiajs/react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Group } from '@/Pages/Groups/types';
import GroupAvatar from './GroupAvatar';
import GroupBanner from './GroupBanner';

interface GroupImageUploadProps {
    group: Group;
    isGroupCreator: boolean;
}

export default function GroupImageUpload({ group, isGroupCreator }: GroupImageUploadProps) {
    const [showAvatarDialog, setShowAvatarDialog] = useState(false);
    const [showBannerDialog, setShowBannerDialog] = useState(false);
    const [showAvatarCrop, setShowAvatarCrop] = useState(false);
    const [showBannerCrop, setShowBannerCrop] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        avatar_image: null as File | null,
        banner_image: null as File | null,
    });

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setShowAvatarCrop(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setShowBannerCrop(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

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
            const file = new File([blob], 'group-image.jpg', { type: 'image/jpeg' });

            return {
                image: file,
                crop: completedCrop,
            };
        } catch (error) {
            console.error('Error processing image:', error);
            return null;
        }
    }

    const submitAvatarUpload = async () => {
        const imageData = await onCropComplete();
        if (imageData && imageData.image) {
            router.post(route('groups.update-images', group.id), {
                avatar_image: imageData.image
            }, {
                onSuccess: () => {
                    setShowAvatarCrop(false);
                    setShowAvatarDialog(false);
                    setImgSrc('');
                    reset();
                },
                onError: (errors: any) => {
                    console.error('Error uploading avatar:', errors);
                },
            });
        }
    };

    const submitBannerUpload = async () => {
        const imageData = await onCropComplete();
        if (imageData && imageData.image) {
            router.post(route('groups.update-images', group.id), {
                banner_image: imageData.image
            }, {
                onSuccess: () => {
                    setShowBannerCrop(false);
                    setShowBannerDialog(false);
                    setImgSrc('');
                    reset();
                },
                onError: (errors: any) => {
                    console.error('Error uploading banner:', errors);
                },
            });
        }
    };

    const deleteAvatar = () => {
        router.post(route('groups.update-images', group.id), {
            delete_avatar: true
        }, {
            onSuccess: () => {
                setShowAvatarDialog(false);
                reset();
            },
        });
    };

    const deleteBanner = () => {
        router.post(route('groups.update-images', group.id), {
            delete_banner: true
        }, {
            onSuccess: () => {
                setShowBannerDialog(false);
                reset();
            },
        });
    };

    if (!isGroupCreator) {
        return null;
    }

    return (
        <Box>
            {/* Avatar Section */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Group Avatar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GroupAvatar group={group} size={80} />
                    <Box>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<PhotoCamera />}
                            onClick={() => avatarInputRef.current?.click()}
                            size="small"
                        >
                            Upload Avatar
                        </Button>
                        {group.avatar_image_path && (
                            <Button
                                variant="outlined"
                                startIcon={<Delete />}
                                onClick={deleteAvatar}
                                size="small"
                                color="error"
                                sx={{ ml: 1 }}
                            >
                                Remove
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Banner Section */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Group Banner
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <GroupBanner group={group} height={150} />
                </Box>
                <Box>
                    <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<PhotoCamera />}
                        onClick={() => bannerInputRef.current?.click()}
                        size="small"
                    >
                        Upload Banner
                    </Button>
                    {group.banner_image_path && (
                        <Button
                            variant="outlined"
                            startIcon={<Delete />}
                            onClick={deleteBanner}
                            size="small"
                            color="error"
                            sx={{ ml: 1 }}
                        >
                            Remove
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Avatar Crop Dialog */}
            <Dialog 
                open={showAvatarCrop} 
                onClose={() => setShowAvatarCrop(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Crop Group Avatar</DialogTitle>
                <DialogContent>
                    {errors.avatar_image && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.avatar_image}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxWidth: '100%', maxHeight: '400px' }}
                            />
                        </ReactCrop>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Drag to move, scroll to zoom. The avatar will be cropped to a circle.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAvatarCrop(false)}>Cancel</Button>
                    <Button 
                        onClick={submitAvatarUpload} 
                        variant="contained" 
                        disabled={processing}
                    >
                        Crop & Upload
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Banner Crop Dialog */}
            <Dialog 
                open={showBannerCrop} 
                onClose={() => setShowBannerCrop(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Crop Group Banner</DialogTitle>
                <DialogContent>
                    {errors.banner_image && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.banner_image}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={3}
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxWidth: '100%', maxHeight: '400px' }}
                            />
                        </ReactCrop>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Drag to move, scroll to zoom. The banner will be cropped to a 3:1 aspect ratio.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowBannerCrop(false)}>Cancel</Button>
                    <Button 
                        onClick={submitBannerUpload} 
                        variant="contained" 
                        disabled={processing}
                    >
                        Crop & Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
