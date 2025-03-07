import { Shelf } from '@/components/library/Shelf';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { useTopTabbarScroll } from '@/hooks/useTopTabbarScroll';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

const MyShelvesTab = () => {
    const { bookController } = useBookContext();
    const { data: shelves, loading, refresh } = useRepository(
        () => bookController.getAllLibraryInfo(), []
    );

    const tabBarHeight = useBottomTabBarHeight();
    const { handleScroll } = useTopTabbarScroll(10);

    // const test = async () => {
    //     console.log(await bookController.library.getAll());
    // }

    useFocusEffect(useCallback(() => {
        refresh();
        // test();
    }, [refresh]));

    return (
        <FlatList
            onScroll={handleScroll}
            data={shelves}
            keyExtractor={(item) => item.id_library.toString()}
            renderItem={({ item, index }) => (
                <Shelf
                    key={item.id_library}
                    title={item.name}
                    idShelf={item.id_library}
                    books={item.books}
                    index={index}
                />
            )}
            contentContainerStyle={[styles.shelvesContainer, { paddingBottom: tabBarHeight }]}
            ListHeaderComponent={
                <Link href="/(app)/AddLibraryModal" asChild>
                    <TouchableOpacity
                        style={{
                            alignSelf: 'center',
                            width: '90%',
                            padding: 10,
                            borderRadius: 20,
                            marginTop: 10,
                            marginBottom: 10,
                            borderWidth: 5,
                            borderStyle: 'dashed',
                        }}
                    >
                        <Text>Add Lib</Text>
                    </TouchableOpacity>
                </Link>
            }
            onRefresh={refresh}
            refreshing={loading}
        />
    );
};

export default MyShelvesTab;

const styles = StyleSheet.create({
    shelvesContainer: {
        padding: 8,
        gap: 8,
    },
});
