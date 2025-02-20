import { Animated, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useRepositoryContext } from '@/hooks/useRepository';
import { BookAllInfos } from '@/models/Book';
import { Ionicons } from '@expo/vector-icons';
import LivreEtagere from '@/components/LivreEtagere';
import BackButton from '@/components/BackButton';


export default function EtagereDetail() {

    const { idEtagere, label } = useLocalSearchParams();
    const { bookRepository, libraryRepository } = useRepositoryContext();
    const navigation = useNavigation();

    const [books, setBooks] = useState<BookAllInfos[]>([]);

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (idEtagere) {
            fetchAllBooksFromLib();
        }
    }, [idEtagere]);

    // Récupère tous les livres de l'étagère
    const fetchAllBooksFromLib = () => {
        try {
            bookRepository.getAllFromLib(idEtagere as string).then((data) => {
                setBooks(data);
            });
        } catch (error) {
            console.error('Error fetching etageres:', error);
        }
    };

    const toggleMenu = () => {
        if (menuVisible) {
            Animated.timing(menuAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.timing(menuAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    };

    const editEtagere = () => {
        console.log("Modifier l'étagère");
        toggleMenu();
    };

    const deleteEtagere = () => {
        console.log("Supprimer l'étagère");
        try {
            libraryRepository.delete(idEtagere as string).then(() => {
                console.log("Etagère supprimée");
                navigation.goBack();
            });
        } catch (error) {
            console.error('Error deleting etagere:', error);
        }
    };


    return (

        <ThemedView style={styles.container}>

             {/* Barre de navigation avec retour + paramètre */}
            <View style={styles.header}>
                
                <BackButton/>

                {/* Icône de paramètres */}
                <View>
                    <TouchableOpacity style={styles.settingsButton} onPress={toggleMenu}>
                        <Ionicons name="settings" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Menu déroulant en icônes */}
                    {menuVisible && (
                        <Animated.View style={[styles.menu, { opacity: menuAnimation }]}>
                            <TouchableOpacity style={styles.menuItem} onPress={editEtagere}>
                                <Ionicons name="create-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={deleteEtagere}>
                                <Ionicons name="trash-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={toggleMenu}>
                                <Ionicons name="close-outline" size={24} color="white" />
                            </TouchableOpacity>                            
                        </Animated.View>
                    )}
                </View>
            </View>

            {/* Nom de l'étagère */}
            <ThemedText type="titreEtagere" style={styles.title}>
                {label}
            </ThemedText>

            {/* Liste des livres de l'étagère */}
            <ScrollView contentContainerStyle={styles.etagereContainer}>
                {books.map((book) => (
                    <LivreEtagere key={book.id_book} livre={book} />
                ))}
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 20,
    },
    settingsButton: {
        backgroundColor: "#333",
        padding: 10,
        borderRadius: 50,
    },
    menu: {
        position: "absolute",
        top: 45,
        right: 0,
        paddingVertical: 5,
        alignItems: "center",
        elevation: 5,
        zIndex: 1,
        gap: 5,
    },
    menuItem: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#333",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        margin: "auto",
    },
    etagereContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
});
