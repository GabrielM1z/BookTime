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
        alignSelf: 'center',
        padding: 3,
        margin: 3,
    },
    coverLivre: {
        backgroundColor: 'yellow',
        width: 100,
        height: 100,
        borderRadius:20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
    },
    titreLivre: {
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
    },
});