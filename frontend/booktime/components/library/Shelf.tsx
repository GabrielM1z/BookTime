import { StyleSheet, View, FlatList } from 'react-native';
import { PressableCover } from '../Cover';
import React from 'react';
import { BookMinInfos } from '@/models/Book';
import { Link } from 'expo-router';
import { useTheme, Text } from 'react-native-paper';

interface ShelfProps {
    title: string;
    idShelf: string;
    books: BookMinInfos[];
    index: number;
}

export const Shelf = ({ title, idShelf, books, index }: ShelfProps) => {
    const { colors, fonts } = useTheme();
    // const colors = ['#ff6961', '#77dd77', '#84b6f4'];
    // const backgroundColor = colors[index % colors.length];

    return (
        <View style={[styles.shelfContainer, { backgroundColor: colors.primaryContainer }]}>
            <View style={styles.header}>
                <Link href={{
                    pathname: "/shelf/[idShelf]",
                    params: { idShelf }
                }}>
                    <Text style={{ color: colors.onPrimaryContainer}} variant={"titleMedium"} >{title}</Text>
                </Link>
            </View>
            <FlatList
                horizontal
                nestedScrollEnabled
                style={styles.flatList}
                data={books}
                keyExtractor={(item) => item.id_book.toString()}
                renderItem={({ item }) => (
                    <PressableCover idBook={item.id_book} uri={item.cover_image_url} width={120} height={180} />
                )}
                contentContainerStyle={styles.flatListContainer}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    shelfContainer: {
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    flatListContainer: {
        gap: 10,
    },
    header: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
