import React, { useCallback, useRef, useMemo, forwardRef, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList, BottomSheetView } from "@gorhom/bottom-sheet";
import { CustomBottomSheet } from "@/common";
import { Library } from "@/models";
import { useBookContext } from "@/contexts/BookContext";
import { useRepository } from "@/hooks/useRepository";
import { Avatar, Text , Button} from "react-native-paper";
import { LibraryBook } from "@/models/LibraryBook";

interface ModalAddToLibraryProps {
    idBookAdded: string,
    closeModal: () => void,
}

export const ModalAddToLibrary = forwardRef<BottomSheetModal, ModalAddToLibraryProps>(({ idBookAdded, closeModal }, ref) => {
    // hooks
    // const ref = useRef<BottomSheetModal>(null);
    const { data: libraryList } = useRepository(() => bookController.library.getAll())
    const bookController = useBookContext();
    const { data: listLibraryOfBook, setData: setListLibraryOfBook, loading, refresh: refreshListLibraryOfBook } = useRepository(() => bookController.library.getAllLibraryFromBook(idBookAdded), [], [idBookAdded])

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChange", index);
    }, []);

    const toggleItemSelect = useCallback((item: Library, bookInLibrary: boolean) => {
        
        if(bookInLibrary){
            setListLibraryOfBook(listLibraryOfBook.filter(obj => obj.id_library !== item.id_library));
        }else{
            setListLibraryOfBook([...listLibraryOfBook, item]);
        }

    }, [idBookAdded, listLibraryOfBook]);

    const renderItem = useCallback(
        ({ item }: { item: Library }) => {
            

            let bookInLibrary = listLibraryOfBook.find(obj => obj.id_library === item.id_library) != undefined


            bookInLibrary? console.log("Library name :", item.name, "Is in library :", bookInLibrary) : ""
            
            return (
            <TouchableOpacity
                onPress={() => toggleItemSelect(item, bookInLibrary)}
                style={[{
                    backgroundColor: bookInLibrary ? 'lightgray' : 'white'

                }, styles.itemContainer]}
            >
                <Avatar.Icon size={24} style={styles.avatarStyle} icon="library" />
                <View >
                    <Text variant="titleMedium">{item.name}</Text>
                    <Text variant="bodyMedium">Livres présents : 10</Text>
                </View>
            </TouchableOpacity>
        )}, [listLibraryOfBook]
    );

    const addListLibraryOfBook = async (listNewLibraryBook: LibraryBook[]) => {
        console.log("listNewLibraryBook :", listNewLibraryBook);

        await bookController.libraryBook.createAll(listNewLibraryBook)
        console.log("books added");

    };

    const deleteListLibraryUnselected = async (listLibraryBookToDelete: LibraryBook[]) => {
        console.log("listLibraryBookToDelete :", listLibraryBookToDelete);
        

        await bookController.libraryBook.deleteAll(listLibraryBookToDelete)
        console.log("books removed");
    };

    const confirmChoice = useCallback(async () => {
        let listNewLibraryBook :LibraryBook[] = [];
        for (const libraryOfBook of listLibraryOfBook) {
            listNewLibraryBook.push({
                id_book: idBookAdded,
                id_library: libraryOfBook.id_library
            })
        }
        addListLibraryOfBook(listNewLibraryBook);

        const selectedIds = new Set(listLibraryOfBook.map(lib => lib.id_library));
        let listLibraryUnselected :Library[] = libraryList.filter(lib => !selectedIds.has(lib.id_library))
        let listLibraryBookToDelete :LibraryBook[] = [];

        for (const libraryOfBook of listLibraryUnselected) {
            listLibraryBookToDelete.push({
                id_book: idBookAdded,
                id_library: libraryOfBook.id_library
            })
        }
        deleteListLibraryUnselected(listLibraryBookToDelete);

        closeModal();
    }, [libraryList, listLibraryOfBook])

    const Footer = ({ animatedFooterPosition }: BottomSheetFooterProps) => {
        return (
            <BottomSheetFooter animatedFooterPosition={animatedFooterPosition} >
                <Button icon="camera" mode="contained" onPress={() => confirmChoice()}>
                    Ajouter aux librairies
                </Button>
            </BottomSheetFooter>
        )
    }

    return (
        <BottomSheetModal
            ref={ref}
            onChange={handleSheetChanges}
            index={1}
            snapPoints={["30%", "50%", "70%"]} // <-- Définition des points d'ancrage
            enableDynamicSizing={true}
            footerComponent={Footer}

        >
            {/* <BottomSheet> */}
            <Text variant="headlineSmall" style={{ marginLeft: "5%" }}>
                Toutes les librairies
            </Text>
            {/* </BottomSheet> */}
            <BottomSheetFlatList
                style={styles.bottomSheetFlatList}
                data={libraryList}
                extraData={listLibraryOfBook}
                renderItem={renderItem}
                keyExtractor={(i) => i.id_library}
            />

        </BottomSheetModal>
    );
});


const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    itemContainer: {
        width: "100%",
        flexDirection: "row",
        padding: 10,
    },
    bottomSheetFlatList: {
        margin: "5%",
        marginBottom: "10%"

    },
    avatarStyle: {
        marginTop: "auto",
        marginBottom: "auto",
        marginRight: "5%"
    }

});
