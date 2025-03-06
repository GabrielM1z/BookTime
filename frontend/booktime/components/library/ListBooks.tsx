import { PressableCover } from '@/components/Cover';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { useSelectableList } from '@/hooks/useSelectableList';
import { useTopTabbarScroll } from '@/hooks/useTopTabbarScroll';
import { Book } from '@/models';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { Searchbar } from "react-native-paper";

const DEFAULT_WIDTH_RANGE = [100, 150];


export interface ListBooksProps<T extends { id_book: string, title: string, cover_image_url: string }> {
    books: T[];
    selectable?: boolean;
    selectedBooks?: Book[];
    searchbar?: boolean;
    loading?: boolean;
    onRefresh?: () => void;
}

// TODO: Check ca, ecrit par GPT pas sur que ca marche bien + prendre en compte le gap par default de FlatList
const calculateBookLayout = () => {
    const screenWidth = Dimensions.get("window").width;
    const width = Math.max(DEFAULT_WIDTH_RANGE[0], Math.min(screenWidth / 2, DEFAULT_WIDTH_RANGE[1]));

    const ratio = 0.667; // Ratio 2:3 (largeur / hauteur)
    const height = width / ratio;

    const columns = Math.floor(screenWidth / width);
    return { width, height, columns };
};

const { width, height, columns } = calculateBookLayout();

export const ListBooks = <T extends { id_book: string, title: string, cover_image_url: string }>({
    books,
    selectable = false,
    selectedBooks = [],
    searchbar = true,
    loading = false,
    onRefresh,
}: ListBooksProps<T>) => {
    const router = useRouter();

    const { } = useSelectableList(books, [], 'id_book', true, []);
    const [search, setSearch] = useState<string>("");

    const tabBarHeight = useBottomTabBarHeight();
    const { handleScroll } = useTopTabbarScroll(10);

    const handleBookPress = (idBook: string) => {
        router.push({
            pathname: "/book/[idBook]",
            params: { idBook, mode: 'library' },
        });
    }

    const filteredBooks = useMemo(() => {
        if (!search) return books;
        return books.filter((book) =>
            book.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [books, search]);

    return (
        <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id_book.toString()}
            renderItem={({ item }) => (
                <PressableCover
                    idBook={item.id_book}
                    title={item.title}
                    uri={item.cover_image_url}
                    width={width}
                    height={height}
                    onPress={handleBookPress}
                />
            )}
            contentContainerStyle={[styles.contentContainer, { paddingBottom: tabBarHeight }]}
            onScroll={handleScroll}
            numColumns={columns}
            columnWrapperStyle={styles.columnWrapper}
            onRefresh={onRefresh}
            refreshing={loading}
            ListHeaderComponent={
                searchbar ? (
                    <Searchbar
                        placeholder="Search"
                        onChangeText={setSearch}
                        value={search}
                    />
                ) : null
            }
            ListHeaderComponentStyle={styles.searchbar}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: "space-between",
    },
    contentContainer: {
        alignItems: "center",
        gap: 20,
    },
    columnWrapper: {
        justifyContent: "space-between",
        gap: 20,
    },
    searchbar: {
        marginTop: 8,
        width: "80%",
    },
});
