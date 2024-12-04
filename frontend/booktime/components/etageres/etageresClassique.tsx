import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Etagere from '@/components/Etagere';
import NewEtagere from '@/components/NewEtagere';
import React, { useEffect, useState } from 'react';
import { getAllLibrary } from '@/db/db-etagere';
import { useSQLiteContext } from 'expo-sqlite';

// import des images
const cover1 = require('@/assets/images/logo_refait.png');

// Sous ecran de la bibliotheque, affichage par étagere CLASSIQUE (celle de l'utilisateur)
export default function pageEtageres() {

	// listes de livres (va devoir etre remplacer par un appel API)
	const books = [
        { title: 'Titre du livre 1', url: cover1 },
        { title: 'Titre du livre 2', url: cover1 },
        { title: 'Titre du livre 3', url: cover1 },
		{ title: 'Titre du livre 4', url: cover1 },
		{ title: 'Titre du livre 5', url: cover1 },
		{ title: 'Titre du livre 6', url: cover1 },
    ];

	const [etageres, setEtageres] = useState([]);

    // Charger les étagères initiales depuis la base de données
    useEffect(() => {
        refreshEtageres();
    }, []);
    const db = useSQLiteContext();

    const refreshEtageres = async () => {
        try {
            const data = await getAllLibrary(db);
            setEtageres(data);
        } catch (error) {
            console.error('Error fetching etageres:', error);
        }
    };

	// Fonction appelée depuis le composant enfant pour ajouter une nouvelle étagère
    const handleAddEtagere = async () => {
        await refreshEtageres(); // Recharge les étagères depuis la base après l'ajout
    };

	console.log(etageres)

    return (
		<ScrollView style={styles.etagereContainer}>
			<NewEtagere onAddEtagere={handleAddEtagere}></NewEtagere>
			{etageres.map((etagere, index) => (
				<Etagere key={index} index={index} label={etagere.name} livres={books}></Etagere>
			))}
		</ScrollView>
	);
}


// style css
const styles = StyleSheet.create({
	etagereContainer: {
		flexDirection: 'column',
	},
});