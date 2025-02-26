import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { BookSearchResult, BookInfosServeur } from '@/models/Book';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Colors } from '@/constants/Colors';
import { useRepositoryContext } from '@/hooks/useRepository';
import CoverPressable from '../CoverPressable';
import api from '@/services/axios';
import { Snackbar, PaperProvider, Portal } from "react-native-paper";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ModalAddToLibrary } from './ModalAddToLibrary';

interface BookSearchItemProps {
    book: BookSearchResult;
    handleModalAddToLibrary: (idBook: string) => void;
}

export const BookSearchItem = ({ book, handleModalAddToLibrary }: BookSearchItemProps) => {

    const { bookRepository, libraryRepository } = useRepositoryContext();
    const [visible, setVisible] = useState(false);
    const [bookAdded, setBookAdded] = useState<keyof typeof Ionicons.glyphMap>("add");

    const showSnackbar = () => setVisible(true);
    const hideSnackbar = () => setVisible(false);

    const handleAddBook = async () => {
        try {
            //Données a récupérer depuis le back !
            let url: string = "/books/books/" + book.isbn13;
            let data: BookInfosServeur = (await api.get(url)).data.data;
            console.log(data);

            const listLibrary = await libraryRepository.getAll()

            await bookRepository.addBookToLibrary(listLibrary[0].id_library, data)
            showSnackbar();


        } catch (error) {
            console.log("error handleAddBook :", error);
            showSnackbar();
        }
    };

    const handleModal = async () => {
        handleModalAddToLibrary(book.isbn13)
    }


    useEffect(()=>{
        libraryRepository.getAllLibraryFromBook(book.isbn13).then((data) => {
            if (data.length != 0) {
                setBookAdded("checkmark")
            }
        })
    });

    return (
        <View style={styles.itemContainer}>
            <CustomSnackbar visible={visible} onDismiss={hideSnackbar} onPressChange={handleModal} />
            <CoverPressable id_book={book.isbn13} cover={book.thumbnail} mode='search'></CoverPressable>
            <View style={styles.itemInfos}>
                <ThemedText type="titreLivreHorizontal" numberOfLines={1}>{book.title}</ThemedText>
                <ThemedText type="auteurLivreHorizontal">{book.authors ? book.authors[0] : "Inconnue"}</ThemedText>
            </View>
            <View style={styles.addItemContainer}>
                <Pressable onPress={handleAddBook} style={bookAdded === "checkmark" ? styles.addedItem : styles.item}>
                    <Ionicons size={20} color={bookAdded === "checkmark" ? "white" : "#1E9AA4"} name={bookAdded} />
                </Pressable>
            </View>
        </View>
    );
}


/** Composant Snackbar pour simplifier `LivreRecherche` */
const CustomSnackbar = ({ visible, onDismiss, onPressChange }: { visible: boolean, onDismiss: () => void, onPressChange: () => void }) => (
    <Portal>
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={3000}
            action={{
                label: "Change",
                onPress: onPressChange,
            }}
        >
            Livre ajouté à "Like"
        </Snackbar>
    </Portal>
);

const styles = StyleSheet.create({
    itemContainer: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 10
    },
    itemImage: {
        backgroundColor: Colors.dark.primary,
        width: 100,
        height: 100,
        borderRadius: 10,
        borderColor: "#1E9AA4",
        borderWidth: 1,
        flex: 2,
    },
    itemInfos: {
        padding: 10,
        flex: 6,
    },
    titreItem: {
        fontSize: 18,
        color: "white"
    },
    autheurItem: {
        fontSize: 17,
        color: "gray",
    },
    addItemContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    item: {
        width: 40,
        height: 40,

        borderColor: "#1E9AA4",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 10,
        backgroundColor: "white",


        justifyContent: "center",
        alignItems: "center",

    },
    addedItem: {
        width: 40,
        height: 40,

        borderColor: "#1E9AA4",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 10,
        backgroundColor: "#1E9AA4",
        color: "white",


        justifyContent: "center",
        alignItems: "center",

    },
});