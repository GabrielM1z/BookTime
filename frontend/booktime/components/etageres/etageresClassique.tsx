import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Etagere from '@/components/Etagere';
import NewEtagere from '@/components/NewEtagere';
import React, { useEffect, useRef, useState } from 'react';
import { useRepositoryContext } from '@/hooks/useRepository';
import TestBtn from '@/components/TestBtn';
import { LibraryWithBooksMin } from '@/models/Library';
import { useFocusEffect } from 'expo-router';

// import des images
const cover1 = require('@/assets/images/logo_refait.png');

// Sous ecran de la bibliotheque, affichage par étagere CLASSIQUE (celle de l'utilisateur)
export default function pageEtageres() {

    const [etageres, setEtageres] = useState<LibraryWithBooksMin[] | []>([]);

    //Se lance à chaque fois que l'utisateur est sur cette page. 
    useFocusEffect(
        React.useCallback(() => {
            // 🆕 Réinitialiser la ref à chaque focus (navigation vers la page)
            refreshEtageres();
        }, [])
    );
    const { libraryRepository } = useRepositoryContext();

    const refreshEtageres = () => {
        try {
            libraryRepository.getAllInfo().then((data) => {
                setEtageres(data);
                console.log("refreshEtageres success")
            })

        } catch (error) {
            console.error('Error fetching etageres:', error);
        }
    };

    // Fonction appelée depuis le composant enfant pour ajouter une nouvelle étagère
    const handleAddEtagere = () => {
        refreshEtageres(); // Recharge les étagères depuis la base après l'ajout
    };

    // console.log("etageres :", JSON.stringify(etageres, null, 2));

    return (
        <ScrollView style={styles.etagereContainer}>
            <NewEtagere onAddEtagere={handleAddEtagere}></NewEtagere>
            <TestBtn></TestBtn>
            {etageres && etageres.map((etagere, index) => (
                <Etagere key={index} idEtagere={etagere.id_library} index={index} label={etagere.name} livres={etagere.books}></Etagere>
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
        height: 90,
    }
});