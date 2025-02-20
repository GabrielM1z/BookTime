import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRepository, useRepositoryContext } from '@/hooks/useRepository';
import LivreEtagere from '../LivreEtagere';
import { BookMinInfos } from '@/models/Book';

// Sous écran de la bibliothèque, affichage de TOUT les LIVRES
export default function pageToutLivre() {
    const [books, setBooks] = useState<BookMinInfos[]>([]);
    const { bookRepository } = useRepositoryContext();

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const fetchAllBooks = () => {
        try {
            bookRepository.getAllMin().then((data) => {
                setBooks(data);
            });
        } catch (error) {
            console.error('Error fetching etageres:', error);
        }
    };

    return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.etagereContainer}>
				{books.map((book) => (
					<LivreEtagere key={book.id_book} livre={book} />
				))}
				<View style={styles.paddingBottom}></View>
			</ScrollView>
		</View>
    );
}

// Style CSS
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
