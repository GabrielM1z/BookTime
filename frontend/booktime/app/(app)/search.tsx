import { BookSearchItem } from "@/components/search/BookSearchItem";
import { ModalAddToLibrary } from "@/components/search/ModalAddToLibrary";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { BookSearchResult } from "@/models/Book";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { debounce } from "lodash";
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<TFilters | null>(null);

    const handlePresentModalPress = () => {
        bottomSheetRef.current?.present();
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

    const handleSearch = (value: string) => {
        setSearchTerm(value);
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
        <SafeAreaView style={{ flex: 1, padding: 10 }}>
            <Searchbar
                autoFocus
                placeholder="Search"
                value={searchTerm}
                onChangeText={handleSearch}
            />
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
    listFooterComponent: {
        flexDirection: 'row',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SearchTab;
