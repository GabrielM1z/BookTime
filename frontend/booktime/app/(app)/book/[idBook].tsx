import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";

import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { useRepositoryContext } from '@/hooks/useRepository';


export default function LivreDetail() {

	const cover1 = require('@/assets/images/logo_refait.png');
	const { idBook } = useLocalSearchParams();
	console.log("idbook : ", idBook)

	const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack();
    };

	// TODO get les info du livre

	const [book, setBook] = useState([]);
	const { bookRepository } = useRepositoryContext();

	useEffect(() => {
		refreshBook();
	}, []);

	const refreshBook = async () => {
		try {
			const data = await bookRepository.get("1");
			console.log("Data received from bookRepository.get:", data);
			setBook(data);
		} catch (error) {
			console.error('Error fetching etageres:', error);
		}
	};

	console.log("book : ", book)

	return (
		<ThemedView style={styles.container}>

			<TouchableOpacity onPress={goBack}>

            </TouchableOpacity>

			<View style={styles.containerTitre}>
				<Image source={cover1} style={styles.coverLivre}></Image>
				
				<View>
					<ThemedText type='titreLivreHorizontal'>{book.title}</ThemedText>
				</View>
				
				
				<Link push href={{
					pathname: "/author/[idAuthor]",
					params: {
						idAuthor: "ouiouioui",
						}
					}}>
					<ThemedText type='auteurLivreHorizontal'>{book.title}</ThemedText>
		  		</Link>
				
			</View>

			<View style={styles.containerResume}>
				<ThemedText type='sousTab'>Résumé</ThemedText>
				<ThemedText>{book.description}</ThemedText>
			</View>
		</ThemedView>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerTitre: {
		alignItems: 'center',
		marginTop: 100,
	},
	containerResume: {
		marginTop: 50,
		width: '90%',
		alignSelf: 'center',
	},
	coverLivre: {
		width: 200,
		height: 200,
		borderRadius:20,
		borderWidth: 5,
		borderColor: Colors.dark.secondary,
	},
});