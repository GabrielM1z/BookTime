import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

// component représentant la COUVERTURE du livre qui est CLIQUABLE
export default function CoverPressable({ cover }) 
{
	
	return (
		<Link push href={{
			pathname: "/book/[idBook]",
			params: {
				idBook: "nononon",
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