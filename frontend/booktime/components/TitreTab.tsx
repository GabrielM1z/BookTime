import { StyleSheet, View, Text } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

// import des component
import { ThemedText } from './ThemedText';

// component qui représente le TITRE du TAB dans lequel on se situe
export default function TitreTab({ label }) {
	
	return (
		<View style={styles.titreContainer}>
            <ThemedText type="titreTab">{label}</ThemedText>
		</View>
	);
}


const styles = StyleSheet.create({
    titreContainer: {
        borderColor: 'black',
        alignSelf: 'center',
        padding: 5,
        margin: 5,
        marginTop: 50,
    },
});