import { ListBooks } from '@/components/library/ListBooks';
import { useBookContext } from '@/contexts/BookContext';
import { useRepository } from '@/hooks/useRepository';
import React from "react";


const AllBooksTab = () => {
    const { bookController } = useBookContext();
    const { data: books, loading, refresh } = useRepository<
        { id_book: string, title: string, cover_image_url: string }[]>(
            () => bookController.book.getAll(["title", "cover_image_url"]), []);

    return (
        <ListBooks books={books} loading={loading} onRefresh={refresh} />
    );
}

export default AllBooksTab;
