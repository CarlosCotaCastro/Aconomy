import { useForm, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import GlassPaper from '@/Components/GlassPaper';
import { useTranslation } from 'react-i18next';

export default function Create({ auth }: { auth: { user: any } }) {
    const { t } = useTranslation();
    const [showAvatarCrop, setShowAvatarCrop] = useState(false);
    const [showBannerCrop, setShowBannerCrop] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [currentImageType, setCurrentImageType] = useState<'avatar' | 'banner' | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        banner_image: null as File | null,
        avatar_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('groups.store'));
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setCurrentImageType('banner');
                setShowBannerCrop(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setCurrentImageType('avatar');
                setShowAvatarCrop(true);
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

    const submitAvatarCrop = async () => {
        const imageData = await onCropComplete();
        if (imageData && imageData.image) {
            setData('avatar_image', imageData.image);
            setShowAvatarCrop(false);
            setImgSrc('');
        }
    };

    const submitBannerCrop = async () => {
        const imageData = await onCropComplete();
        if (imageData && imageData.image) {
            setData('banner_image', imageData.image);
            setShowBannerCrop(false);
            setImgSrc('');
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('groups.createNewGroup')}
                </Typography>

                <GlassPaper>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label={t('groups.groupName')}
                            value={data.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label={t('groups.groupDescription')}
                            value={data.description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('description', e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                            multiline
                            rows={4}
                            sx={{ mb: 3 }}
                        />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            Group Images (Optional)
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Group Banner
                            </Typography>
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="outlined"
                                onClick={() => bannerInputRef.current?.click()}
                                size="small"
                            >
                                Select Banner Image
                            </Button>
                            {data.banner_image && (
                                <Typography variant="caption" color="success.main" sx={{ ml: 2 }}>
                                    ✓ Banner selected
                                </Typography>
                            )}
                            {errors.banner_image && (
                                <Typography color="error" variant="caption" display="block">
                                    {errors.banner_image}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Group Avatar
                            </Typography>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="outlined"
                                onClick={() => avatarInputRef.current?.click()}
                                size="small"
                            >
                                Select Avatar Image
                            </Button>
                            {data.avatar_image && (
                                <Typography variant="caption" color="success.main" sx={{ ml: 2 }}>
                                    ✓ Avatar selected
                                </Typography>
                            )}
                            {errors.avatar_image && (
                                <Typography color="error" variant="caption" display="block">
                                    {errors.avatar_image}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <PrimaryButton
                                type="submit"
                                variant="contained"
                                disabled={processing}
                            >
                                {t('groups.createNewGroup')}
                            </PrimaryButton>
                            <Button
                                component={Link}
                                href={route('groups.index')}
                                variant="outlined"
                            >
                                {t('common.cancel')}
                            </Button>
                        </Box>
                    </form>
                </GlassPaper>

                {/* Avatar Crop Dialog */}
                <Dialog 
                    open={showAvatarCrop} 
                    onClose={() => setShowAvatarCrop(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Crop Group Avatar</DialogTitle>
                    <DialogContent>
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
                            onClick={submitAvatarCrop} 
                            variant="contained"
                        >
                            Crop & Select
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
                            onClick={submitBannerCrop} 
                            variant="contained"
                        >
                            Crop & Select
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AuthenticatedLayout>
    );
}
