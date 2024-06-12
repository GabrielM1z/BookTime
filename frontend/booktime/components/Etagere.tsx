import { StyleSheet, View, Text, ScrollView } from 'react-native';
import LivreEtagere from './LivreEtagere';

const cover1 = require('../assets/images/logo_refait.png');

export default function Etagere({ label, livres }) 
{	
    const books = [
        { title: 'Titre du livre 1', url: cover1 },
        { title: 'Titre du livre 2', url: cover1 },
        { title: 'Titre du livre 3', url: cover1 },
		{ title: 'Titre du livre 4', url: cover1 },
		{ title: 'Titre du livre 5', url: cover1 },
		{ title: 'Titre du livre 6', url: cover1 },
    ];

	return (
		<View style={styles.etagereContainer}>

            <View style={styles.titreContainer}>
                <Text style={styles.titreEtagere}>{label}</Text>
            </View>

            <ScrollView horizontal style={styles.livresContainer}>
                {books.map((book, index) => (
                    <LivreEtagere key={index} label={book.title} cover={book.url}></LivreEtagere>
                ))}
            </ScrollView>

		</View>
	);
}


const styles = StyleSheet.create({
    etagereContainer: {
		backgroundColor: 'red',
		position: 'absolute',
		top: 200,
		alignSelf: 'center',
		width: '90%',
    },
	titreContainer: {
		backgroundColor: 'green',
    },
    livresContainer: {
		backgroundColor: 'blue',
		flexDirection: 'row',

  	},
	  titreEtagere: {
		backgroundColor: 'grey',
		alignSelf: 'flex-start',
  	},
});