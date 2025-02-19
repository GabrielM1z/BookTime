import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";

import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { useRepository } from '@/hooks/useRepository';
import LibraryChoice from '@/components/LibraryChoice';
import axios from 'axios';
import { baseURL } from '@/constants/Api';
import { BookAllInfos } from '@/models/Book';
import { linkToBase64 } from '@/helpers/image';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';


export default function LivreDetail() {

    const { bookRepository } = useRepository();
    const navigation = useNavigation();
    const { idBook, cover, mode } = useLocalSearchParams();

    const [book, setBook] = useState<BookAllInfos>();
    const [expandedResume, setExpandedResume] = useState(false);

    // 🔹 Vérifier si `cover` est bien une chaîne avant d'essayer de parser
    // let parsedCover = null;
    // try {
    //     parsedCover = cover && typeof cover === 'string' ? JSON.parse(cover) : null;
    // } catch (error) {
    //     console.error("Error parsing cover:", error);
    // }

    console.log("mode:", mode);

    const getBookFromBack = async (url: string) => {
        try {
            let bookData = (await axios.get(url));
            let imageBase64 = await linkToBase64(bookData.data.data.cover_image_url)
            const book: BookAllInfos = {
                id_book: bookData.data.data.id_book,
                title: bookData.data.data.title,
                description: bookData.data.data.description,
                publisher: bookData.data.data.publisher,
                publication_date: bookData.data.data.publication_date,
                page_number: bookData.data.data.page_number,
                language: bookData.data.data.language,
                cover_image_url: imageBase64,
            };
            setBook(book);
            // console.log("Book fetched:", bookData);

        } catch (error) {
            console.error("Error fetching book:", error);
        }
    }

    const getBookFromFront = async (idBook: string) => {
        try {
            let book = await bookRepository.get(idBook)
            setBook(book);
            console.log("chargement book front :", book.title)

        } catch (error) {
            console.error("Error fetching book from local DB:", error);
        }
    }

    useEffect(() => {
        if (!idBook || typeof idBook !== 'string') {
            console.error("Invalid idBook type:", typeof idBook);

        } // Sécurité si `idBook` est undefined ou est une liste de string
        else if (mode === "search") {
            console.log("Fetching book from server DB...");
            const url = baseURL + `/books/books/` + idBook;
            getBookFromBack(url);

        } else if (mode === "library") {
            console.log("Fetching book from local DB...");
            getBookFromFront(idBook)

        } else {
            console.log("Mode inconnu :", mode);
        }
    }, [idBook, mode]); // Dépendances du `useEffect`

    // Fonction pour revenir en arrière
    const goBack = () => {
        navigation.goBack();
    };

    return (
        <ThemedView style={styles.container}>

            <View style={styles.header}>
                <BackButton/>
            </View>

            <View style={styles.containerTitre}>

                {/* 🔹 Vérification si `parsedCover` ou `book.cover_image_url` est disponible */}
                {book ? (
                    <Image source={{ uri: book.cover_image_url }} style={styles.coverLivre} />
                ) : (
                    <ThemedText>Aucune image disponible</ThemedText>
                )}

                <View>
                    <ThemedText type='titreLivreHorizontal'>{book?.title || "Titre inconnu"}</ThemedText>
                </View>

                {/* TODO: mettre le bon id de l'auteur */}
                <Link push href={{
                    pathname: "/author/[idAuthor]",
                    params: {
                        idAuthor: "test",
                    }
                }}>
                    {/* TODO: mettre le bon nom de l'auteur */}
                    <ThemedText type='auteurLivreHorizontal'>{book?.title || "Auteur inconnu"}</ThemedText>
                </Link>

            </View>

            {/* Résumé avec affichage tronqué */}
            <View style={styles.containerResume}>
                <ThemedText type='sousTab'>Résumé</ThemedText>
                <ThemedText>
                    {expandedResume || !book?.description
                        ? book?.description || "Pas de description disponible."
                        : `${book?.description.substring(0, 200)}...`} {/* Affiche seulement 200 caractères */}
                </ThemedText>
                {book?.description && book?.description.length > 200 && (
                    <TouchableOpacity onPress={() => setExpandedResume(!expandedResume)}>
                        <ThemedText style={styles.expandedResume}>
                            {expandedResume ? "Voir moins" : "Voir plus"}
                        </ThemedText>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.containerResume}>
                <ThemedText type='sousTab'>Bibliothèques</ThemedText>
                <LibraryChoice book={book}/>
            </View>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    containerTitre: {
        alignItems: 'center',
        marginTop: 30,
    },
    containerResume: {
        marginTop: 50,
        width: '90%',
        alignSelf: 'center',
    },
    coverLivre: {
        width: 200,
        height: 200,
        borderRadius: 20,
        borderWidth: 5,
        borderColor: Colors.dark.secondary,
    },
    expandedResume: {
        color: Colors.dark.secondary,
        marginTop: 5,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
});