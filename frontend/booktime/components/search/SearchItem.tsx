import { withAnimated } from '@/common';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SearchCover } from '../Cover';
import { ManageLibrarySnackbar } from '../snackbar';

const IconButtonAnimated = withAnimated(IconButton);

export interface SearchItemProps {
    idBook: string;
    title: string;
    authors?: string[];
    uri: string;
}

export const SearchItem = ({ idBook, title, authors, uri }: SearchItemProps) => {
    const scale = useSharedValue(1);
    const bookController = useBookContext();
    const router = useRouter();

    const { data: checked, refresh } = useRepository(async () => (await bookController.library.getFirstFromBook(idBook)) != null, false);

    const handlePress = async () => {
        // FIXME: the animation is not triggered when the user remove all lib from ManageLibraryModal
        scale.value = withSpring(1.2, { damping: 8, stiffness: 100 }, () => {
            scale.value = withSpring(1);
        });

        let liked;
        if (!checked) {
            liked = await bookController.library.getFirst(); // TODO: replace by getLikedLibrary and move to useManageLibrarySnackbar ?
        }

        if (liked) {
            await bookController.addBook(idBook, liked.id_library); // FIXME: this take a lot of time try to async it
            ManageLibrarySnackbar.show(liked!.name, idBook);
            refresh();
        } else {
            router.push({ pathname: "/(app)/ManageLibraryModal", params: { idBook } });
        }
    };

    useFocusEffect(() => {
        refresh();
    });

    const handleItemPress = () => {
        router.push({ pathname: "/book/[idBook]", params: { idBook } });
    };

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }), [checked]);

    const iconStyle = useMemo(() => [
        styles.icon,
        iconAnimatedStyle,
    ], [iconAnimatedStyle]);

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={handleItemPress}>
                <SearchCover uri={uri} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    {authors && <Text style={styles.authors} numberOfLines={1}>{authors.join(', ')}</Text>}
                </View>
                <IconButtonAnimated
                    icon={checked ? "check" : "plus"}
                    mode={"contained"}
                    style={iconStyle}
                    onPress={handlePress}
                    selected={checked}
                />
            </TouchableOpacity >
            <Divider />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    image: {
        width: 80,
        height: 100,
        borderRadius: 4,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    authors: {
        fontSize: 14,
        color: '#666',
    },
    icon: {
        borderRadius: 30,
        alignSelf: "center",
    },
});
