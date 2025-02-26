import { defaultCover } from '@/assets/images';
import { BookMinInfos } from '@/models/Book';
import React, { useMemo, useState } from 'react';
import { Image, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

interface BookProps {
    book: BookMinInfos;
    showTitle?: boolean;
    style?: StyleProp<ViewStyle>
    onPress?: (idBook: string) => void;
    onLongPress?: (idBook: string) => void;
    onPressOut?: () => void;
    // preserveAspectRatio?: boolean; // TODO: Implement this feature
}

export const Book = ({
    book,
    showTitle = true,
    style,
    onPress,
    onLongPress,
    onPressOut,
    
}: BookProps) => {
    const [imageError, setImageError] = useState(false);
    const containerStyle = useMemo(() => StyleSheet.flatten([styles.container, style]), [style]);

    return (
        <TouchableOpacity
            style={containerStyle}
            onPress={() => onPress?.(book.id_book)}
            onLongPress={() => onLongPress?.(book.id_book)}
            onPressOut={onPressOut}
        >
            <Image
                source={imageError || !book.cover_image_url ? defaultCover : { uri: book.cover_image_url }}
                style={styles.image}
                onError={() => setImageError(true)}
            />
            {showTitle && (
                <Text style={[styles.title, { width: containerStyle.width }]} numberOfLines={2} ellipsizeMode="tail">
                    {book.title}
                </Text>
            )}
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: 10,
        width: 150,
        height: 150,
    },
    image: {
        borderRadius: 10,
        flex: 1,
        width: "100%",
        height: "100%",
    },
    title: {
        marginTop: 5,
        textAlign: "center",
    },
});