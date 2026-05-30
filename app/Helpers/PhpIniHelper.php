<?php

namespace App\Helpers;

class PhpIniHelper
{
    /**
     * Calculate the maximum image size in KB based on PHP ini settings
     */
    public static function getMaxImageSizeKB(): int
    {
        // Get upload_max_filesize in bytes
        $uploadMaxFilesize = static::parseIniSize(ini_get('upload_max_filesize'));
        
        // Get post_max_size in bytes
        $postMaxSize = static::parseIniSize(ini_get('post_max_size'));
        
        // Get memory_limit in bytes
        $memoryLimit = static::parseIniSize(ini_get('memory_limit'));
        
        // Use the smallest of the three, but ensure it's at least 1MB
        $maxSizeBytes = min($uploadMaxFilesize, $postMaxSize, $memoryLimit);
        
        // Convert to KB and ensure minimum of 1MB (1024 KB)
        $maxSizeKB = max(1024, intval($maxSizeBytes / 1024));
        
        return $maxSizeKB;
    }

    /**
     * Parse PHP ini size string (e.g., "8M", "16K", "2G") to bytes
     */
    private static function parseIniSize(string $size): int
    {
        $size = trim($size);
        $last = strtolower($size[strlen($size) - 1]);
        $size = (int) $size;

        switch ($last) {
            case 'g':
                $size *= 1024;
                // fall through
            case 'm':
                $size *= 1024;
                // fall through
            case 'k':
                $size *= 1024;
        }

        return $size;
    }
}
