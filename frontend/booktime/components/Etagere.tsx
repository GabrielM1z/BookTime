import { StyleSheet, View, Text, ScrollView } from 'react-native';
import LivreEtagere from '@/components/LivreEtagere';
import { ThemedText } from './ThemedText';
import React from 'react';
import { LibraryWithBooksMin } from '@/models/Library';
import { BookMinInfos } from '@/models/Book';

const cover1 = require('../assets/images/logo_refait.png');


// component représentant une ETAGERE
interface EtagereProps {
	label: string;
	livres: BookMinInfos[];
	index: number;
}

export default function Etagere({ label, livres, index }: EtagereProps) 
{	
	// couleur possible
	const colors = [
		'#ff6961',
		'#77dd77',
		'#84b6f4'
	]; 

	console.log("livres : ", livres)
	
	// on fait une rotation sur les coouleurs
	const randomindex = index%3;

	return (
		<View style={[styles.etagereContainer, { backgroundColor: colors[randomindex] }]}>

            <View style={styles.titreContainer}>
                <ThemedText type="titreEtagere">{label}</ThemedText>
            </View>

            <ScrollView horizontal style={styles.livresContainer}>
                {livres.map((livre, index) =>  livre.id_book !== null ? (
                    <LivreEtagere key={index} id_book={livre.id_book} label={livre.title} cover={livre.cover_image_url}></LivreEtagere>
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
		padding:10,
		borderRadius:20,
    },
	titreContainer: {
		marginBottom: 5,
    },
    livresContainer: {
		flexDirection: 'row',
	},
});