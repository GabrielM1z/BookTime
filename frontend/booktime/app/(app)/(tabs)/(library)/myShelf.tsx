import Etagere from '@/components/Etagere';
import NewEtagere from '@/components/NewEtagere';
import { useBookContext } from '@/contexts/BookContext';
import { LibraryWithBooksMin } from '@/models/Library';
import { useFocusEffect } from 'expo-router';
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const MyShelfTab = () => {
    const [etageres, setEtageres] = useState<LibraryWithBooksMin[] | []>([]);

    //Se lance à chaque fois que l'utisateur est sur cette page. 
    useFocusEffect(
        React.useCallback(() => {
            // 🆕 Réinitialiser la ref à chaque focus (navigation vers la page)
            refreshEtageres();
        }, [])
    );
    const bookController = useBookContext();

    const refreshEtageres = () => {
        try {
            bookController.library.getAllInfo().then((data) => {
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
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.etagereContainer}>
                <NewEtagere onAddEtagere={handleAddEtagere}></NewEtagere>
                {etageres && etageres.map((etagere, index) => (
                    <Etagere key={index} idEtagere={etagere.id_library} index={index} label={etagere.name} livres={etagere.books}></Etagere>
                ))}
                <View style={styles.paddingBottom}></View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default MyShelfTab;

const styles = StyleSheet.create({
    etagereContainer: {
        flexDirection: 'column',
        height: 600,
    },
    paddingBottom: {
        height: 90,
    }
});
