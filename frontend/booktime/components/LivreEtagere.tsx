import { StyleSheet, View, Text, Image } from 'react-native';


export default function LivreEtagere({ label, cover }) {
	
	return (
		<View style={styles.livreContainer}>
            <Image source={cover} style={styles.coverLivre} />
            <Text style={styles.titreLivre}>{label}</Text>
		</View>
	);
}


const styles = StyleSheet.create({
    livreContainer: {
        borderWidth: 1,
        borderColor: 'black',
        alignSelf: 'center',
        padding: 5,
        margin: 5,
    },
    coverLivre: {
        backgroundColor: 'yellow',
        width: 100,
        height: 100,
    },
    titreLivre: {
        backgroundColor: 'purple',
    },
});