import { PressableCover } from '@/components/Cover';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { useTopTabbarScroll } from '@/hooks/useTopTabbarScroll';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { Searchbar } from "react-native-paper";

const DEFAULT_WIDTH_RANGE = [100, 150];


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

const AllBooksTab = () => {
    const router = useRouter();
    const { bookController } = useBookContext();
    const { data: books, loading, refresh } = useRepository<
        { id_book: string, title: string, cover_image_url: string }[]>(
            () => bookController.book.getAll(["title", "cover_image_url"]), []);
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
            onRefresh={refresh}
            refreshing={loading}
            ListHeaderComponent={
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearch}
                    value={search}
                />
            }
            ListHeaderComponentStyle={styles.searchbar}
        />
    );
}

export default AllBooksTab;

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
