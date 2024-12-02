import { StyleSheet, View, Image } from 'react-native';
import React from "react";

import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';


export default function AuthorDetail() {

	const author_pp = require('@/assets/images/logo_refait.png');
	const { idAuthor } = useLocalSearchParams();

	return (
		<ThemedView style={styles.container}>

			<View style={styles.containerTitre}>
				<Image source={author_pp} style={styles.coverLivre}></Image>
				<ThemedText type='titreLivreHorizontal'>{idAuthor}</ThemedText>
			</View>

			<View style={styles.containerResume}>
				<ThemedText type='sousTab'>Résumé</ThemedText>
				<ThemedText>Lorem zvze zef zefjz eflz efz lef ZLKE PQ VKQ V QKVJ KJV EKR V j ks dvjs fdvj lsd vls dvs vlk sdv sldv sljdv sld vlsd vlsd vls d</ThemedText>
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