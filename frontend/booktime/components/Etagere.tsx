import { StyleSheet, View, Text, ScrollView } from 'react-native';

// import component
import LivreEtagere from './LivreEtagere';
import { ThemedText } from './ThemedText';

const cover1 = require('../assets/images/logo_refait.png');


// component représentant une ETAGERE
export default function Etagere({ label, livres, index }) 
{	
	// couleur possible
	const colors = [
		'#ff6961',
		'#77dd77',
		'#84b6f4'
    ]; 
	
	// on fait une rotation sur les coouleurs
	const randomindex = index%3;

	return (
		<View style={[styles.etagereContainer, { backgroundColor: colors[randomindex] }]}>

            <View style={styles.titreContainer}>
                <ThemedText type="titreEtagere">{label}</ThemedText>
            </View>

            <ScrollView horizontal style={styles.livresContainer}>
                {livres.map((livre, index) => (
                    <LivreEtagere key={index} label={livre.title} cover={livre.url}></LivreEtagere>
                ))}
            </ScrollView>

		</View>
	);
}


const styles = StyleSheet.create({
    etagereContainer: {
		alignSelf: 'center',
		width: '90%',
		marginTop: 10,
		marginBottom: 10,
		padding:10,
		borderRadius:20,
    },
	titreContainer: {
		marginBottom: 5,
    },
    livresContainer: {
		flexDirection: 'row',
  	},
});