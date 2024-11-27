import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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

// import des styles
import libraryStyles from '../../styles/libraryStyles';


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

	const getLibraryFromBack = () => {

	};

	// affichage général
    return (
        <ThemedView style={libraryStyles.container}>
			<SafeAreaProvider>
				<SafeAreaView>

					
					<TitreTab label={"Bibliotheque"}></TitreTab>
					
					<SearchBar qrcode={true} onSearch={getLibraryFromBack}></SearchBar>
				

					<View style={libraryStyles.containerBtn}>

					<TouchableOpacity 
							style={activeTab === 'etagereClassique' ? libraryStyles.activeBtn : libraryStyles.btn} 
							onPress={() => setActiveTab('etagereClassique')}
						>
							<ThemedText type='sousTab'>
								Mes étagères
							</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity 
							style={activeTab === 'allBooks' ? libraryStyles.activeBtn : libraryStyles.btn} 
							onPress={() => setActiveTab('allBooks')}
						>
							<ThemedText type='sousTab'>
								Tout mes livres
							</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity 
							style={activeTab === 'etageresByGenre' ? libraryStyles.activeBtn : libraryStyles.btn} 
							onPress={() => setActiveTab('etageresByGenre')}
						>
							<ThemedText type='sousTab'>
								Genre
							</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity 
							style={activeTab === 'etageresByType' ? libraryStyles.activeBtn : libraryStyles.btn} 
							onPress={() => setActiveTab('etageresByType')}
						>
							<ThemedText type='sousTab'>
								Type
							</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity 
							style={activeTab === 'etageresByAuthor' ? libraryStyles.activeBtn : libraryStyles.btn} 
							onPress={() => setActiveTab('etageresByAuthor')}
						>
							<ThemedText type='sousTab'>
								Auteur
							</ThemedText>
						</TouchableOpacity>

					</View>

					{renderContent()}

					</SafeAreaView>
			</SafeAreaProvider>

		</ThemedView>	
	);
}
