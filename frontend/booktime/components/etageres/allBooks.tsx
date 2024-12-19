import { ScrollView, StyleSheet } from 'react-native';

// import des component
import React, { useEffect, useState } from 'react';
import { useRepository } from '@/hooks/useRepository';
import Livre from '../Livre';
import LivreEtagere from '../LivreEtagere';

// import des images
const cover1 = require('@/assets/images/logo_refait.png');

// TODO faire correctmenet ce truc
// Sous ecran de la bibliotheque, affichage de TOUT les LIVRES
export default function pageToutLivre() 
{
	const [books, setBooks] = useState([]);
	const { bookRepository } = useRepository();

	useEffect(() => {
		refreshBooks();
	}, []);

	const refreshBooks = async () => {
        try {
            const data = await bookRepository.getAll();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching etageres:', error);
        }
    };


    return (
		<ScrollView style={styles.etagereContainer}>
			{books.map((book, index) => (
				<LivreEtagere key={book.id_book} id_book={book.id_book} label={book.title} cover={cover1}></LivreEtagere>
			))}
		</ScrollView>
	);
}


// style css
const styles = StyleSheet.create({
	etagereContainer: {
		flexDirection: 'column',
	},
});