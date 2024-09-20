import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Link, useNavigation } from 'expo-router';

// component représentant la COUVERTURE du livre qui est CLIQUABLE
export default function CoverPressable({ cover }) 
{
	

	return (
		<Link href={{
			pathname: "/book/[idBook]",
			params: {
				idBook: "ouiouioui",
			  }
		  }} asChild>
			<TouchableOpacity>
				<Image source={cover} style={styles.coverLivre} />
			</TouchableOpacity>
		</Link>
	);
}


const styles = StyleSheet.create({
    coverLivre: {
        width: 100,
        height: 100,
        borderRadius:20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
    },
});