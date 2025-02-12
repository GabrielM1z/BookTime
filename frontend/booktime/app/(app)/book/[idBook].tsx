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


export default function LivreDetail() {

	const { bookRepository } = useRepository();
	const navigation = useNavigation();
	const { idBook, cover, mode } = useLocalSearchParams();

	const [book, setBook] = useState<BookAllInfos | null>(null);
	const [expandedResume, setExpandedResume] = useState(false);

	// 🔹 Vérifier si `cover` est bien une chaîne avant d'essayer de parser
    let parsedCover = null;
    try {
        parsedCover = cover && typeof cover === 'string' ? JSON.parse(cover) : null;
    } catch (error) {
        console.error("Error parsing cover:", error);
    }

	console.log("mode:", mode);


	useEffect(() => {
        if (!idBook) return; // Sécurité si `idBook` est undefined

        if (mode === "search") {
            const url = `${baseURL}/books/books/${idBook}`;
            axios.get(url)
                .then(response => {
                    if (response.data && response.data.data) {
                        const bookData: BookAllInfos = {
                            id_book: response.data.data.id_book,
                            title: response.data.data.title,
                            description: response.data.data.description,
                            publisher: response.data.data.publisher,
                            publication_date: response.data.data.publication_date,
                            page_number: response.data.data.page_number,
                            language: response.data.data.language,
                            cover_image_url: response.data.data.cover_image_url,
                        };
                        setBook(bookData);
                        console.log("Book fetched:", bookData);
                    } else {
                        console.error("Invalid response structure:", response.data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching book:", error);
                });

        } else if (mode === "library") {
            console.log("Fetching book from local DB...");
            if (typeof idBook === 'string') {
                bookRepository.get(idBook)
                    .then(data => {
                        setBook(data);
                    })
                    .catch(error => {
                        console.error("Error fetching book from local DB:", error);
                    });
            } else {
                console.error("Invalid idBook type:", typeof idBook);
            }
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

			<TouchableOpacity onPress={goBack}>

            </TouchableOpacity>

			<View style={styles.containerTitre}>

				{/* 🔹 Vérification si `parsedCover` ou `book.cover_image_url` est disponible */}
                {parsedCover ? (
                    <Image source={parsedCover} style={styles.coverLivre} />
                ) : book?.cover_image_url ? (
                    <Image source={{ uri: book.cover_image_url }} style={styles.coverLivre} />
                ) : (
                    <ThemedText>Aucune image disponible</ThemedText>
                )}
				
				<View>
                    <ThemedText type='titreLivreHorizontal'>{book?.title || "Titre inconnu"}</ThemedText>
                </View>
				
				
				<Link push href={{
					pathname: "/author/[idAuthor]",
					params: {
						idAuthor: "ouiouioui",
						}
					}}>
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
				<ThemedText type='sousTab'>Ajouter</ThemedText>
				<LibraryChoice></LibraryChoice>
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
	expandedResume: {
        color: Colors.dark.secondary,
        marginTop: 5,
        fontWeight: 'bold',
    },
});