import { ListBooks } from '@/components/library/ListBooks';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import { useTopTabbarScroll } from '@/hooks/useTopTabbarScroll';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from 'expo-router';
import React from "react";


const AllBooksTab = () => {
    const { bookController } = useBookContext();
    const { data: books, loading, refresh } = useRepository<
        { id_book: string, title: string, cover_image_url: string }[]>(
            () => bookController.book.getAll(["title", "cover_image_url"]), []);

    const { handleScroll } = useTopTabbarScroll(10);
    const tabBarHeight = useBottomTabBarHeight();

    useFocusEffect(() => {
        refresh();
    });

    return (
        <ListBooks
            books={books}
            loading={loading}
            onRefresh={refresh}
            onScroll={handleScroll}
            contentContainerStyle={{ paddingBottom: tabBarHeight }}
        />
    );
}

export default AllBooksTab;
