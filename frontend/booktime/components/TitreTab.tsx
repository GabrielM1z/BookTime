import { StyleSheet, View, Text } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";



export default function TitreTab({ label }) {
	
	return (
		<View style={styles.titreContainer}>
            <Text style={styles.titreTexte}>{label}</Text>
		</View>
	);
}


const styles = StyleSheet.create({
    titreContainer: {
        borderWidth: 1,
        borderColor: 'black',
        alignSelf: 'center',
        padding: 5,
        margin: 5,
        top: 50,
    },
    titreTexte: {
        fontSize: 40,
		fontWeight: 'bold',
		color: 'white',
  },
});