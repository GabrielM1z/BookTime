import { BookSearchItem } from "@/components/search/BookSearchItem";
import { ModalAddToLibrary } from "@/components/search/ModalAddToLibrary";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { BookSearchResult } from "@/models/Book";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Text, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { debounce } from "lodash";

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
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const router = useRouter();
    const [filters, setFilters] = useState<TFilters | null>(null);
    const [query, setQuery] = useState<string>("");

    const handlePresentModalPress = () => {
        bottomSheetRef.current?.present();
    };

    const handleCancel = () => {
        router.back();
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

    const debounceSearch = debounce(fetchData, 500);

    const handleTextChange = (value: string) => {
        setQuery(value);
        debounceSearch(value);
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
            <View style={styles.headerContainer}>
                <Searchbar // FIXME: Height not working
                    mode="view"
                    value={query}
                    onChangeText={handleTextChange}
                    style={styles.searchbar}
                    inputStyle={styles.textInput}
                    placeholder="Search"
                    icon="arrow-left"
                    onIconPress={handleCancel}
                    autoFocus
                    showDivider={false}
                />
            </View>
            <FlatList
                keyExtractor={item => item.isbn13}
                initialNumToRender={NUMBER_OF_ITEMS}
                onEndReached={onEndReached}
                removeClippedSubviews={true}
                data={removeDuplicates(data)}
                renderItem={({ item }) => <BookSearchItem book={item} handleModalAddToLibrary={handlePresentModalPress} />}
                ListEmptyComponent={
                    <View>
                        <Text>{'noResult'}</Text>
                    </View>
                }
                ListFooterComponent={
                    <View style={styles.listFooterComponent}>
                        {isFetchingNextPage && <ActivityIndicator />}
                    </View>
                }
            />
            <ModalAddToLibrary ref={bottomSheetRef} />
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
