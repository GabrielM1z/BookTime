import { StyleSheet, View, Text, ScrollView } from 'react-native';
import {LivreEtagere} from '@/components/LivreEtagere';
import { ThemedText } from './ThemedText';
import React from 'react';
import { LibraryWithBooksMin } from '@/models/Library';
import { BookMinInfos } from '@/models/Book';
import { Link } from 'expo-router';

// component représentant une ETAGERE
interface EtagereProps {
	label: string;
	idEtagere: string;
	livres: BookMinInfos[];
	index: number;
}

export default function Etagere({ label, idEtagere, livres, index }: EtagereProps) {
	// couleur possible
	const colors = [
		'#ff6961',
		'#77dd77',
		'#84b6f4'
	];

	console.log("livres : ", livres)

	// on fait une rotation sur les coouleurs
	const randomindex = index % 3;

	return (
		<View style={[styles.etagereContainer, { backgroundColor: colors[randomindex] }]}>

			<View style={styles.titreContainer}>
				<Link push href={{
					pathname: "/(app)/etagere/[idEtagere]",
					params: {
						idEtagere: idEtagere,
						label: label,
					}
				}}>
					<View>
						<ThemedText type="titreEtagere">{label}</ThemedText>
					</View>
				</Link>
			</View>

			<ScrollView horizontal style={styles.livresContainer}>
				{livres.map((livre, index) => livre.id_book !== null ? (
					<LivreEtagere key={index} livre={livre}></LivreEtagere>
				) : null
				)}
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
		padding: 10,
		borderRadius: 20,
	},
	titreContainer: {
		marginBottom: 5,
	},
	livresContainer: {
		flexDirection: 'row',
	},
});