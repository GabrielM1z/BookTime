import { AppBar } from '@/common';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { useSelectableList } from '@/hooks/useSelectableList';
import { Library } from '@/models';
import { Link, Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Divider, Icon, Searchbar, Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ManageLibraryModal = () => {
    const router = useRouter();
    const { idBook } = useLocalSearchParams<{ idBook: string }>();
    const scrollViewRef = useAnimatedRef<Animated.FlatList<Library>>();
    const [search, setSearch] = useState<string>("");

    const { bookController } = useBookContext();
    const { data: libraries, refresh: refreshAll } = useRepository(() => bookController.library.getAll(), [], [idBook]);
    const { data: defaultLibraries } = useRepository(() => bookController.library.getAllFromBook(idBook), [], [idBook, libraries]);
    const { selectedItems, toggleSelection, isSelected, unselectedItems } = useSelectableList(libraries, defaultLibraries, 'id_library', true, [defaultLibraries]);
    // FIXME: Got 'user_id' in library don't know why

    const librariesSorted = useMemo(() => {
        const selectedSet = new Set(selectedItems.map(item => item.id_library));
        const selectedLibraries = libraries.filter(item => selectedSet.has(item.id_library));
        const unselectedLibraries = libraries.filter(item => !selectedSet.has(item.id_library));
        return [...selectedLibraries, ...unselectedLibraries];
    }, [libraries]);

    const filteredBooks = useMemo(() => {
        if (!search) return librariesSorted;
        return librariesSorted.filter((library) =>
            library.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [librariesSorted, search]);

    const handleDone = useCallback(async () => {
        console.log(unselectedItems(), selectedItems);
        await bookController.libraryBook.deleteAll(unselectedItems().map(
            (library: Library) => ({ id_book: idBook, id_library: library.id_library })
        ));
        await bookController.libraryBook.createAll(selectedItems.map(
            (library: Library) => ({ id_book: idBook, id_library: library.id_library })
        ));
        router.back();
    }, [unselectedItems, selectedItems, idBook]);

    useFocusEffect(
        useCallback(() => {
            refreshAll();
        }, [refreshAll])
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen name="ManageLibraryModal" options={{
                title: "Manage library",
                presentation: "modal",
                animation: "fade_from_bottom",
                headerShown: true,
                header: (props: any) => (<AppBar scrollViewRef={scrollViewRef} {...props} />)
            }} />
            <FlatList
                ref={scrollViewRef}
                data={filteredBooks}
                extraData={selectedItems}
                keyExtractor={item => item.id_library}
                renderItem={({ item }) => (
                    <Item
                        item={item}
                        isSelected={isSelected(item)}
                        onPress={toggleSelection}
                    />
                )}
                ListHeaderComponent={
                    <View style={{ alignItems: 'center', padding: 8, gap: 8, paddingBottom: 16 }}>
                        <Link href="/(app)/AddLibraryModal" asChild>
                            <Button mode='contained-tonal'>Add Library</Button>
                        </Link>
                        <Searchbar placeholder="Search" value={search} onChangeText={setSearch} />
                    </View>
                }
            />
            <View style={styles.footerContainer}>
                <Button mode='contained' onPress={handleDone}>Done</Button>
            </View>
        </SafeAreaView>
    );
}

interface ItemProps {
    item: Library;
    isSelected: boolean;
    onPress: (item: Library) => void;
}

const Item = ({ item, isSelected, onPress }: ItemProps) => {
    const { colors } = useTheme();

    const handlePress = useCallback(() => {
        onPress(item);
    }, [item, onPress]);

    return (
        <>
            <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
                <Text>{item.name}</Text>
                <Icon source={isSelected ? 'check-circle' : 'circle-outline'} size={24} color={colors.onPrimaryContainer} />
            </TouchableOpacity>
            <Divider />
        </>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        padding: 8,
        // position: 'absolute',
        // bottom: 0,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        paddingVertical: 30
    },
});

export default ManageLibraryModal;
