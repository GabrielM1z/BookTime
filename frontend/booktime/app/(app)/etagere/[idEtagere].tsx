import { Animated, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useRepository } from '@/hooks/useRepository';
import { BookAllInfos } from '@/models/Book';
import { Ionicons } from '@expo/vector-icons';
import LivreEtagere from '@/components/LivreEtagere';


export default function EtagereDetail() {

    const navigation = useNavigation();
    const { idEtagere, label } = useLocalSearchParams();
    const { bookRepository } = useRepository();

    const [books, setBooks] = useState<BookAllInfos[] | null>(null);

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (!idEtagere) return; // Sécurité si `idEtagere` est undefined

        // Charger les livres de l'étagère depuis la base de données
        if (typeof idEtagere === 'string') {
            bookRepository.getAllFromLib(idEtagere)
                .then(books => {
                    console.log("Books fetched:", books);
                }).catch(error => {
                    console.error("Error fetching books:", error);
                });
        } else {
            console.error("Invalid idEtagere:", idEtagere);
        }
    }, [idEtagere]);

    const goBack = () => {
        navigation.goBack();
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
        toggleMenu();
    };


    return (

        <ThemedView style={styles.container}>

             {/* Barre de navigation avec retour + paramètre */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {/* Icône de paramètres */}
                <View>
                    <TouchableOpacity style={styles.settingsButton} onPress={toggleMenu}>
                        <Ionicons name="settings" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Menu déroulant en icônes */}
                    {menuVisible && (
                        <Animated.View style={[styles.menu, { opacity: menuAnimation }]}>
                            <TouchableOpacity style={styles.menuItem} onPress={editEtagere}>
                                <Ionicons name="create-outline" size={24} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={deleteEtagere}>
                                <Ionicons name="trash-outline" size={24} color="red" />
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
            <ScrollView style={styles.etagereContainer}>
                {books && books.map((book, index) => (
                    <LivreEtagere key={book.id_book} livre={book}></LivreEtagere>
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
    backButton: {
        backgroundColor: "#333",
        padding: 10,
        borderRadius: 50,
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
        flexDirection: "column",
    },
});
