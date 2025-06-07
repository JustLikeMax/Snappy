import { Colors } from '@/constants/Colors';
import { SupabaseStorageService } from '@/services/SupabaseService';
import { Image, ImageProps } from 'expo-image';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { IconName, IconSymbol } from './IconSymbol';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
    /** The image URL to display */
    imageUrl?: string | null;
    /** The size for the image (used for both width and height for avatars) */
    size?: number;
    /** Image optimization options */
    optimization?: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'webp' | 'jpeg' | 'png';
        resize?: 'cover' | 'contain' | 'fill';
    };
    /** Whether this is an avatar (applies circular styling and fallback) */
    isAvatar?: boolean;    /** Fallback icon to show when no image is available */
    fallbackIcon?: IconName;
    /** Custom fallback component */
    fallbackComponent?: React.ReactNode;
    /** Container style */
    containerStyle?: ViewStyle;
}

export function OptimizedImage({
    imageUrl,
    size,
    optimization,
    isAvatar = false,
    fallbackIcon = 'person.fill',
    fallbackComponent,
    containerStyle,
    style,
    ...props
}: OptimizedImageProps) {
    // Get optimized image URL
    const optimizedUrl = imageUrl
        ? isAvatar
            ? SupabaseStorageService.getAvatarUrl(imageUrl, size || 120)
            : SupabaseStorageService.getOptimizedImageUrl(imageUrl, optimization)
        : null;

    // Calculate dimensions
    const dimensions = size ? { width: size, height: size } : {};
    const borderRadius = isAvatar && size ? size / 2 : undefined;

    // Render fallback
    const renderFallback = () => {
        if (fallbackComponent) {
            return fallbackComponent;
        }

        return (
            <View
                style={[
                    {
                        backgroundColor: Colors.accent,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius,
                        ...dimensions,
                    },
                    containerStyle,
                ]}
            >
                <IconSymbol
                    name={fallbackIcon}
                    size={size ? size * 0.4 : 24}
                    color={Colors.icon}
                />
            </View>
        );
    };

    // If no image URL, show fallback
    if (!optimizedUrl) {
        return renderFallback();
    }

    return (
        <View style={[{ borderRadius }, containerStyle]}>
            <Image
                source={{ uri: optimizedUrl }}
                style={[
                    {
                        borderRadius,
                        ...dimensions,
                    },
                    style,
                ]}
                placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
                transition={200}
                contentFit="cover"
                {...props}
            />
        </View>
    );
}

/**
 * Pre-configured avatar component
 */
export function Avatar({
    imageUrl,
    size = 120,
    containerStyle,
    ...props
}: Omit<OptimizedImageProps, 'isAvatar' | 'fallbackIcon'>) {
    return (
        <OptimizedImage
            imageUrl={imageUrl}
            size={size}
            isAvatar={true}
            fallbackIcon="person.fill"
            containerStyle={containerStyle}
            {...props}
        />
    );
}

/**
 * Pre-configured responsive image component for different screen sizes
 */
export function ResponsiveImage({
    imageUrl,
    aspectRatio = 1,
    maxWidth = 400,
    ...props
}: OptimizedImageProps & {
    aspectRatio?: number;
    maxWidth?: number;
}) {
    const optimization = {
        width: maxWidth,
        height: Math.round(maxWidth / aspectRatio),
        quality: 85,
        format: 'webp' as const,
        resize: 'cover' as const,
    };

    return (
        <OptimizedImage
            imageUrl={imageUrl}
            optimization={optimization}
            style={{
                width: '100%',
                maxWidth,
                aspectRatio,
            }}
            {...props}
        />
    );
}
