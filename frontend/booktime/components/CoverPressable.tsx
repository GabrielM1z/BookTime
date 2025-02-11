import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';

// component représentant la COUVERTURE du livre qui est CLIQUABLE
export default function CoverPressable({ id_book, cover }) 
{
	// TODO: Faire une diff entre les livre venant de la recherche et les livres de l'étagère
	// car les livres de la recherches ne sont pas dans la BDD
	
	return (
		<Link push href={{
			pathname: "/book/[idBook]",
			params: {
				idBook: id_book,
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