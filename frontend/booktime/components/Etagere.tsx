import { StyleSheet, View, Text, ScrollView } from 'react-native';

// import component
import LivreEtagere from './LivreEtagere';

const cover1 = require('../assets/images/logo_refait.png');


// component ETAGERE
export default function Etagere({ label, livres, index }) 
{	
	const colors = [
		'#ff6961',
		'#77dd77',
		'#84b6f4'
    ]; 
	

	const randomindex = index%3;

	return (
		<View style={[styles.etagereContainer, { backgroundColor: colors[randomindex] }]}>

            <View style={styles.titreContainer}>
                <Text style={styles.titreEtagere}>{label}</Text>
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
	  titreEtagere: {
		alignSelf: 'flex-start',
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
		backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 10,
		padding: 5
  	},
});