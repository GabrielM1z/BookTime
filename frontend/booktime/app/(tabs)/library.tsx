import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

// import de constantes
import { Colors } from '@/constants/Colors';

// import des components
import SearchBar from '@/components/SearchBar';
import { ThemedView } from '@/components/ThemedView';
import TitreTab from '@/components/TitreTab';
import { ThemedText } from '@/components/ThemedText';

// import des sous pages
import EtagereClassique from '@/components/etageres/etageresClassique';
import AllBooks from '@/components/etageres/allBooks';
import EtagereByGenre from '@/components/etageres/etageresByGenre';
import EtageresByTypes from '@/components/etageres/etageresByTypes';
import EtageresByAuthor from '@/components/etageres/etageresByAuthor';


// Ecran de la BIBLIOTHEQUE
export default function LibrairyScreen({}) {

	// on est de base dans l'état "etagereClassique"
	const [activeTab, setActiveTab] = useState('etagereClassique');

	// fonciton d'affichage du contenu de la page (dépend des btn en haut)
	const renderContent = () => {
		
		// toutes les pages disponiblaes
		switch (activeTab) 
		{
		  	case 'etagereClassique':
				return <EtagereClassique />;

			case 'allBooks':
				return <AllBooks />;

			case 'etageresByGenre':
				return <EtagereByGenre />;

			case 'etageresByType':
				return <EtageresByTypes />;

			case 'etageresByAuthor':
				return <EtageresByAuthor />;

			default:
				return <EtagereClassique />;
		}
	}

	// affichage général
    return (
        <ThemedView style={styles.container}>

			<TitreTab label={"Bibliothèque"}></TitreTab>

			<SearchBar qrcode={true}></SearchBar>

            <View style={styles.containerBtn}>

			<TouchableOpacity 
					style={activeTab === 'etagereClassique' ? styles.activeBtn : styles.btn} 
					onPress={() => setActiveTab('etagereClassique')}
				>
					<ThemedText type='sousTab'>
						Mes étagères
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity 
					style={activeTab === 'allBooks' ? styles.activeBtn : styles.btn} 
					onPress={() => setActiveTab('allBooks')}
				>
					<ThemedText type='sousTab'>
						Tout mes livres
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity 
					style={activeTab === 'etageresByGenre' ? styles.activeBtn : styles.btn} 
					onPress={() => setActiveTab('etageresByGenre')}
				>
					<ThemedText type='sousTab'>
						Genre
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity 
					style={activeTab === 'etageresByType' ? styles.activeBtn : styles.btn} 
					onPress={() => setActiveTab('etageresByType')}
				>
					<ThemedText type='sousTab'>
						Type
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity 
					style={activeTab === 'etageresByAuthor' ? styles.activeBtn : styles.btn} 
					onPress={() => setActiveTab('etageresByAuthor')}
				>
					<ThemedText type='sousTab'>
						Auteur
					</ThemedText>
				</TouchableOpacity>

			</View>

			{renderContent()}

		</ThemedView>	
	);
}


// style css
const styles = StyleSheet.create({
  	container: {
		flex: 1,
	},
	etagereContainer: {
		flexDirection: 'column',
	},
	btn: {
		backgroundColor: Colors.dark.primary,
		borderColor: Colors.dark.secondary,
		borderWidth: 2,
		borderRadius: 100,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginRight: 5,
		marginTop: 5,
	},
	activeBtn: {
		backgroundColor: Colors.dark.secondary,
		borderColor: Colors.dark.secondary,
		borderWidth: 2,
		borderRadius: 100,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginRight: 5,
		marginTop: 5,
	},
	containerBtn: {
		flexDirection: 'row',
        flexWrap: 'wrap',
    },
});