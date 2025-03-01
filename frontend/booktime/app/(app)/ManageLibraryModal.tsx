import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme, Button, Icon, Divider, Text, Searchbar } from 'react-native-paper';
import { useSelectableList } from '@/hooks/useSelectableList';
import { Library } from '@/models';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar } from '@/common';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

const ManageLibraryModal = () => {
    const { idBook } = useLocalSearchParams<{ idBook: string }>();
    const scrollViewRef = useAnimatedRef<Animated.FlatList<Library>>();
    const [search, setSearch] = useState<string>("");

    const bookController = useBookContext();
    const { data: libraries } = useRepository(() => bookController.library.getAll(), []);
    const { data: defaultLibraries } = useRepository(() => bookController.library.getAllLibraryFromBook(idBook), [], [idBook])
    const { selectedItems, toggleSelection, isSelected } = useSelectableList(libraries, defaultLibraries, true);
    const librariesSorted = useMemo(() => [
        ...selectedItems,
        ...libraries.filter(item => !selectedItems.includes(item))
    ], [libraries]);

    const filteredBooks = useMemo(() => {
        if (!search) return librariesSorted;
        return librariesSorted.filter((library) =>
            library.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [librariesSorted, search]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
                            <Button mode='contained-tonal'>Add Library</Button>
                            <Searchbar placeholder="Search" value={search} onChangeText={setSearch} />
                        </View>
                    }
                />
                <View style={styles.footerContainer}>
                    <Button mode='contained'>Press me</Button>
                </View>
            </KeyboardAvoidingView>
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
