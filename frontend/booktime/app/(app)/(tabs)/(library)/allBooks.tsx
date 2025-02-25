import { BookMinInfos } from '@/models/Book';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LivreEtagere from '@/components/LivreEtagere';
import { useController } from '@/hooks/useController';

const AllBooksTab = () => {
    const [books, setBooks] = useState<BookMinInfos[]>([]);
    const { bookController } = useController();

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const fetchAllBooks = () => {
        try {
            bookController.book.getAll(["title", "cover_image_url"]).then((data) => {
                setBooks(data);
            });
        } catch (error) {
            console.error('Error fetching etageres:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView contentContainerStyle={styles.etagereContainer}>
                {books.map((book) => (
                    <LivreEtagere key={book.id_book} livre={book} />
                ))}
                <View style={styles.paddingBottom}></View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AllBooksTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    etagereContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    paddingBottom: {
        width: '100%',
        height: 90,
    }
});
