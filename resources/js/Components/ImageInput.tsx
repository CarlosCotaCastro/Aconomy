import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    Card,
    CardMedia,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';

interface ImageInputProps {
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    maxSizeKB?: number;
    accept?: string;
    label?: string;
    showPreview?: boolean;
    previewUrl?: string;
    onPreviewChange?: (url: string | null) => void;
    sx?: any;
}

export default function ImageInput({
    value,
    onChange,
    error,
    maxSizeKB,
    accept = "image/*",
    label,
    showPreview = true,
    previewUrl,
    onPreviewChange,
    sx = {},
}: ImageInputProps) {
    const { t } = useTranslation();
    const { props } = usePage();
    const [showSizeError, setShowSizeError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get the effective max size - use prop if provided, otherwise fall back to global setting
    const effectiveMaxSizeKB = maxSizeKB || (props.maxImageSizeKB as number) || 8192;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            onChange(null);
            if (onPreviewChange) {
                onPreviewChange(null);
            }
            return;
        }

        // Check file size (convert KB to bytes)
        const maxSizeBytes = effectiveMaxSizeKB * 1024;
        
        if (file.size > maxSizeBytes) {
            setShowSizeError(true);
            onChange(null);
            if (onPreviewChange) {
                onPreviewChange(null);
            }
            // Clear the input
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            return;
        }
        
        onChange(file);

        // Create preview URL if needed
        if (showPreview && onPreviewChange) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onPreviewChange(e.target?.result as string || null);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatFileSize = (sizeKB: number): string => {
        if (sizeKB >= 1024) {
            return `${(sizeKB / 1024).toFixed(0)}MB`;
        }
        return `${sizeKB}KB`;
    };

    const getSizeRestrictionsText = (): string => {
        const maxSize = formatFileSize(effectiveMaxSizeKB);
        return t('items.imageSizeRestrictions', { maxSize, defaultValue: `Maximum file size: ${maxSize}. Supported formats: JPEG, PNG, JPG, GIF` });
    };

    const getSizeErrorTitle = (): string => {
        const maxSize = formatFileSize(effectiveMaxSizeKB);
        return t('items.imageTooLarge', { defaultValue: 'Image file is too large' });
    };

    const getSizeErrorMessage = (): string => {
        const maxSize = formatFileSize(effectiveMaxSizeKB);
        return t('items.imageTooLargeMessage', { 
            maxSize, 
            defaultValue: `The selected image is larger than ${maxSize}. Please choose a smaller image.` 
        });
    };

    return (
        <Box sx={sx}>
            <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 1 }}
            >
                {label || t('items.uploadImage')}
                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    onChange={handleImageChange}
                    accept={accept}
                />
            </Button>

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                {getSizeRestrictionsText()}
            </Typography>

            {error && (
                <FormHelperText error>{error}</FormHelperText>
            )}

            {showPreview && previewUrl && (
                <Card sx={{ mt: 2, maxWidth: 300 }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={previewUrl}
                        alt={t('items.imagePreview')}
                        sx={{ objectFit: 'contain' }}
                    />
                </Card>
            )}

            {/* Image Size Error Dialog */}
            <Dialog
                open={showSizeError}
                onClose={() => setShowSizeError(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Alert severity="error" sx={{ mb: 0 }}>
                        {getSizeErrorTitle()}
                    </Alert>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {getSizeErrorMessage()}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSizeError(false)} variant="contained">
                        {t('common.cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
