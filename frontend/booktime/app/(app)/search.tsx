import { BookSearchItem } from "@/components/search/BookSearchItem";
import { ModalAddToLibrary } from "@/components/search/ModalAddToLibrary";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Book, BookSearchResult } from "@/models/Book";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useNavigation, useRouter } from "expo-router";
import { SearchItem } from "@/components/search/SearchItem";
import { ManageLibrarySnackbar } from "@/components/snackbars";
import { SearchAppBar } from "@/common/AppBar";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { useManageLibrarySnackbar } from "@/components/snackbar/ManageLibrarySnackbar";
import { useBookContext } from "@/contexts/BookContext";

type TFilters = {
    query: string;
};

const NUMBER_OF_ITEMS = 10;

// ISBN différents smais id Google Book dupliqué 
// !!!!! SOLUTION TEMPORAIRE !!!!!
const removeDuplicates = (items: BookSearchResult[]): BookSearchResult[] => {
    const seenIds = new Set<string>();
    return items.filter((item) => {
        if (seenIds.has(item.isbn13)) {
            return false;
        } else {
            seenIds.add(item.isbn13);
            return true;
        }
    });
};

const SearchTab = () => {
    const navigation = useNavigation();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const scrollViewRef = useAnimatedRef<Animated.FlatList<BookSearchResult>>();
    const router = useRouter();
    const bookController = useBookContext();

    const [filters, setFilters] = useState<TFilters | null>(null);
    const [idLastBookAdded, setIdLastBookAdded] = useState<string>("")

    const { visible, library, show, hide } = useManageLibrarySnackbar();

    const handlePresentModalPress = (id_book: string) => {
        setIdLastBookAdded(id_book)
        bottomSheetRef.current?.present();
    };

    const closeModal = () => {
        bottomSheetRef.current?.close();
    };

    const fetchData = (query: string) => {
        if (!query) {
            setFilters(null);
            return;
        }
        setFilters({
            ...filters,
            query,
        });
    };

    const handleBack = useCallback(() => {
        // Check if one book has been added to the library
        if (library !== "") {
            router.push("/(app)/(tabs)/(library)/myShelves");
        } else {
            router.back();
        }
    }, [router, library]);

    const handleAddBook = (idBook: string, checked: boolean) => {
        // const libraryName = bookController.
        // if (checked) {
        //     show(library);
        // }
    };

    const {
        data,
        onEndReached,
        isFetchingNextPage
    } = useInfiniteScroll<BookSearchResult, TFilters>({
        url: "/books/search/",
        filters,
        limit: NUMBER_OF_ITEMS,
        initialPage: 0,
        key: 'search',
    });

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                header: (props) => (
                    <SearchAppBar
                        scrollViewRef={scrollViewRef}
                        onSearchChange={fetchData}
                        onBack={handleBack}
                    />
                )
            }} />
            <Animated.FlatList
                ref={scrollViewRef}
                keyExtractor={item => item.isbn13}
                initialNumToRender={NUMBER_OF_ITEMS}
                onEndReached={onEndReached}
                removeClippedSubviews={true}
                data={removeDuplicates(data)}
                renderItem={({ item }) => (
                    <SearchItem
                        idBook={item.isbn13}
                        title={item.title}
                        authors={item.authors}
                        uri={item.thumbnail}
                        onCheck={handleAddBook}
                        onPress={(idBook) => router.push({ pathname: "/book/[idBook]", params: { idBook } })}
                    />
                )}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {isFetchingNextPage ? <ActivityIndicator /> : <Text>No results</Text>}
                    </View>
                }
                ListFooterComponent={
                    <View style={styles.listFooterComponent}>
                        {isFetchingNextPage && <ActivityIndicator />}
                    </View>
                }
            />
            <ModalAddToLibrary ref={bottomSheetRef} idBookAdded={idLastBookAdded} closeModal={closeModal} />
            <ManageLibrarySnackbar
                library={library}
                visible={visible}
                onDismiss={hide}
                onPressChange={() => router.push("/(modal)/addLibrary")}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listFooterComponent: {
        flexDirection: 'row',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
    },
    searchbar: {
        flex: 1,
        height: 50,
    },
    textInput: {
        height: 40,
        padding: 0,
        margin: 0,
    },
})

export default SearchTab;
