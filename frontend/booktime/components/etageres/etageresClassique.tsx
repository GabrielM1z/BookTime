import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Etagere from '@/components/Etagere';
import NewEtagere from '@/components/NewEtagere';
import React, { useEffect, useState } from 'react';
import { useRepository } from '@/hooks/useRepository';
import TestBtn from '@/components/TestBtn';
import { LibraryWithBooksMin } from '@/models/Library';

// import des images
const cover1 = require('@/assets/images/logo_refait.png');

// Sous ecran de la bibliotheque, affichage par étagere CLASSIQUE (celle de l'utilisateur)
export default function pageEtageres() {

    const [etageres, setEtageres] = useState<LibraryWithBooksMin[] | null>([]);

    // Charger les étagères initiales depuis la base de données
    useEffect(() => {
        refreshEtageres();
    }, []);

    const { libraryRepository } = useRepository();

    const refreshEtageres = async () => {
        try {
            const data = await libraryRepository.getAllInfo();
            setEtageres(data);
            
        } catch (error) {
            console.error('Error fetching etageres:', error);
        }
    };

	// Fonction appelée depuis le composant enfant pour ajouter une nouvelle étagère
    const handleAddEtagere = async () => {
        await refreshEtageres(); // Recharge les étagères depuis la base après l'ajout
    };

    console.log("etageres :", JSON.stringify(etageres, null, 2));

    return (
		<ScrollView style={styles.etagereContainer}>
			<NewEtagere onAddEtagere={handleAddEtagere}></NewEtagere>
            <TestBtn></TestBtn>
            {etageres && etageres.map((etagere, index) => (
				<Etagere key={index} index={index} label={etagere.name} livres={etagere.books}></Etagere>
			))}
            <View style={styles.paddingBottom}></View>
		</ScrollView>
	);
}


// style css
const styles = StyleSheet.create({
	etagereContainer: {
		flexDirection: 'column',
        height: 600,
	},
    paddingBottom: {
        height: 80,
    }
});