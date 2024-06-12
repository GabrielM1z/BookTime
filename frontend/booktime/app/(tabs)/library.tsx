import { StyleSheet, Text, View } from 'react-native';

import TitreTab from '../../components/TitreTab';
import LivreEtagere from '../../components/Etagere';


export default function HomeScreen() {
    return (
        <View style={styles.container}>
			<TitreTab label={"Bibliothèque"}></TitreTab>

			<LivreEtagere label='etagere 1' livres={undefined} ></LivreEtagere>

			<LivreEtagere label='etagere 1' livres={undefined} ></LivreEtagere>

			<LivreEtagere label='etagere 1' livres={undefined} ></LivreEtagere>
        </View>	
	);
}


const styles = StyleSheet.create({
  	container: {
		flex: 1,
		backgroundColor: '#25292e',
	},
});