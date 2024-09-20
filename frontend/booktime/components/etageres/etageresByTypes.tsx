import { ScrollView, StyleSheet } from 'react-native';

// import des component
import Etagere from '@/components/Etagere';

// import des images
const cover1 = require('@/assets/images/logo_refait.png');


// Sous ecran de la bibliotheque, affichage par TYPES
export default function pageType() {

	// listes de livres (va devoir etre remplacer par un appel API)
	const books = [
        { title: 'Titre du livre 1', url: cover1 },
        { title: 'Titre du livre 2', url: cover1 },
        { title: 'Titre du livre 3', url: cover1 },
		{ title: 'Titre du livre 4', url: cover1 },
		{ title: 'Titre du livre 5', url: cover1 },
		{ title: 'Titre du livre 6', url: cover1 },
    ];
	// listes d'étagères (va devoir etre remplacer par un appel API)
	const etageres = [
		{ title: 'Type 1', books: books},
		{ title: 'Type 2', books: books},
		{ title: 'Type 3', books: books},
		{ title: 'Type 4', books: books},
		{ title: 'Type 5', books: books},
		{ title: 'Type 6', books: books},
		{ title: 'Type 7', books: books},
		{ title: 'Type 8', books: books},
		{ title: 'Type 9', books: books},
		{ title: 'Type 10', books: books},
	]

    return (
		<ScrollView style={styles.etagereContainer}>
			{etageres.map((etagere, index) => (
				<Etagere key={index} index={index} label={etagere.title} livres={etagere.books}></Etagere>
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