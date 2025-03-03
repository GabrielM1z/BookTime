import { SearchAppBar } from "@/common/AppBar";
import { SearchItem } from "@/components/search/SearchItem";
import { ManageLibrarySnackbarComponent } from "@/components/snackbar/ManageLibrarySnackbar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { BookSearchResult } from "@/models/Book";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import Animated, { useAnimatedRef } from "react-native-reanimated";
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
    const router = useRouter();
    const scrollViewRef = useAnimatedRef<Animated.FlatList<BookSearchResult>>();

    const [filters, setFilters] = useState<TFilters | null>(null);
    const { data, onEndReached, isFetchingNextPage } = useInfiniteScroll<BookSearchResult, TFilters>({
        url: "/books/search/",
        filters,
        limit: NUMBER_OF_ITEMS,
        initialPage: 0,
        key: 'search',
    });

    // TODO: chnage debounce to useDeferredValue or both

    const fetchData = useCallback((query: string) => {
        if (!query) {
            setFilters(null);
            return;
        }
        setFilters({
            ...filters,
            query,
        });
    }, [filters]);

    // TODO
    // const handleBack = useCallback(() => {
    //     // Check if one book has been added to the library
    //     if (libraryName !== "") {
    //         router.push("/(app)/(tabs)/(library)/myShelves");
    //     } else {
    //         router.back();
    //     }
    // }, [router, libraryName]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                header: (props) => (
                    <SearchAppBar
                        scrollViewRef={scrollViewRef}
                        onSearchChange={fetchData}
                        onBack={handleBack}
                        {...props}
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
            <ManageLibrarySnackbarComponent />
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
