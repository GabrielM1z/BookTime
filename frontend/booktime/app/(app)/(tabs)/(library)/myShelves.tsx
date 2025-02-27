import NewEtagere from '@/components/NewEtagere';
import { Shelf } from '@/components/library/Shelf';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { useTopTabbarScroll } from '@/hooks/useTopTabbarScroll';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from "react";
import { FlatList, StyleSheet } from 'react-native';

const MyShelvesTab = () => {
    const bookController = useBookContext();
    const { data: shelves, loading, refresh } = useRepository(
        () => bookController.library.getAllInfo(), []
    );

    const tabBarHeight = useBottomTabBarHeight();
    const { handleScroll } = useTopTabbarScroll(10);

    const handleAddEtagere = () => {
        refresh();
    };

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
            ListHeaderComponent={<NewEtagere onAddEtagere={handleAddEtagere} />}
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
