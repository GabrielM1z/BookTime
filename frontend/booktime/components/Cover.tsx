import { defaultCover } from '@/assets/images';
import { linkToBase64 } from '@/helpers/image';
import { Image, ImageProps } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

const DEFAULT_SIZE = 150;

export interface CoverProps extends Omit<ImageProps, 'source' | 'placeholder'> {
    idBook: string,
    title?: string,
    uri: string,
    showTitle?: boolean;
    width?: number;
    height?: number;
    ratio?: number;
    loading?: boolean;
}

export interface PressableCoverProps extends CoverProps {
    onPress?: (idBook: string) => void;
    onLongPress?: (idBook: string) => void;
}

export interface SelectableCoverProps extends PressableCoverProps {
    selected?: boolean;
    onSelectionMode?: (idBook: string) => void;
    selectionMode?: boolean;
    onToggle?: (idBook: string, selected: boolean) => void;
}

export interface SearchCoverProps extends Omit<CoverProps, 'idBook'> { }

export const Cover = ({
    idBook,
    title,
    uri,
    showTitle = false,
    width,
    height,
    ratio,
    loading,
    ...imageProps
}: CoverProps) => {
    const [imageRatio, setImageRatio] = useState(1);
    const [_loading, setLoading] = useState(true);

    const calculatedWidth = useMemo(() => {
        if (width) return width;
        if (height) return height * imageRatio;
        return DEFAULT_SIZE;
    }, [width, height, imageRatio]);

    const calculatedHeight = useMemo(() => {
        if (height) return height;
        if (width) return width / imageRatio;
        return DEFAULT_SIZE;
    }, [width, height, imageRatio]);

    const imageStyle = useMemo(() =>
        StyleSheet.flatten([styles.image, imageProps.style, { width: calculatedWidth, height: calculatedHeight }]),
        [imageProps.style, calculatedWidth, calculatedHeight]
    );

    const memorizedImage = useMemo(() => (
        <Image
            source={{ uri: uri }}
            style={imageStyle}
            placeholder={defaultCover}
            {...imageProps}
            onLoadStart={imageProps.onLoadStart ?? (() => setLoading(true))}
            onLoadEnd={imageProps.onLoadEnd ?? (() => setLoading(false))}
            onError={imageProps.onError ?? ((e) => setLoading(false))}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setImageRatio(width / height);
            }}
        />
    ), [uri, imageStyle, imageProps]);

    return (
        <View>
            {memorizedImage}
            {(loading ?? _loading) && (
                <ActivityIndicator style={styles.activityIndicator} />
            )}
            {showTitle && title && (
                <Text style={[styles.title, { width: calculatedWidth }]} numberOfLines={2} ellipsizeMode="tail">
                    {title}
                </Text>
            )}
        </View>
    );
}

export const PressableCover = ({
    onPress,
    ...coverProps
}: PressableCoverProps) => {
    const router = useRouter();

    const handleDefaultPress = useCallback(
        () => router.push({
            pathname: "/book/[idBook]",
            params: { idBook: coverProps.idBook }
        }),
        [coverProps.idBook]
    );

    return (
        <TouchableOpacity
            onPress={() => onPress?.(coverProps.idBook) ?? handleDefaultPress()}
        >
            <Cover {...coverProps} />
        </TouchableOpacity>
    );
}


// TODO: style + add checkmark
export const SelectableCover = ({
    selected,
    onToggle,
    onSelectionMode,
    selectionMode,
    ...coverProps
}: SelectableCoverProps) => {
    const handlePress = useCallback(() => {
        return selected ? onToggle?.(coverProps.idBook, selected) : undefined;
    }, [selected]);

    return (
        <PressableCover
            {...coverProps}
            onLongPress={() => onSelectionMode?.(coverProps.idBook)}
            onPress={handlePress}
        />
    );
}

export const SearchCover = ({
    ...coverProps
}: SearchCoverProps) => {
    const { uri, ...rest } = coverProps;
    const [source, setSource] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        linkToBase64(uri).then((data) => {
            setSource(data)
        }).finally(() => setLoading(false));
    }, [uri]);

    return (
        <Cover
            idBook=""
            uri={source}
            loading={loading}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: 10,
    },
    image: {
        borderRadius: 10,
        flex: 1,
    },
    title: {
        marginTop: 5,
        textAlign: "center",
    },
    activityIndicator: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
