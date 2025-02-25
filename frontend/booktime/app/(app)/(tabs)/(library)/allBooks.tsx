import { Book } from '@/components/library/Book';
import { useController } from '@/hooks/useController';
import { useRepository } from '@/hooks/useRepository';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const { bookController } = useController();
    const { data: books, loading, refresh } = useRepository(
        () => bookController.book.getAll(["title", "cover_image_url"]), []);
    const [search, setSearch] = useState<string>("");

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
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <FlatList
                data={filteredBooks}
                keyExtractor={(item) => item.id_book.toString()}
                renderItem={({ item }) => (
                    <Book book={item} style={{ width, height }} onPress={handleBookPress} />
                )}
                numColumns={columns}
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
        </SafeAreaView>
    );
}

export default AllBooksTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchbar: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
});
