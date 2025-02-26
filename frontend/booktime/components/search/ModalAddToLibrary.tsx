import React, { useCallback, useRef, useMemo, forwardRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList, BottomSheetView } from "@gorhom/bottom-sheet";
import { CustomBottomSheet } from "@/common";
import { Library } from "@/models";
import { useController } from "@/hooks/useController";

interface ModalAddToLibraryProps {
    idBookAdded: string,
    closeModal: () => void,
}

export const ModalAddToLibrary = forwardRef<BottomSheetModal, ModalAddToLibraryProps>(({ idBookAdded, closeModal }, ref) => {
    // hooks
    // const ref = useRef<BottomSheetModal>(null);
    const [libraryList, setLibraryList] = useState<Library[]>([])
    const { bookController } = useController();

    // libraryRepository.getAll().then((data) => {
    //     console.log(data)
    //     setLibraryList(data)
    // })

    useEffect(() => {
        bookController.library.getAll().then((data) => {
            console.log(data)
            setLibraryList(data)
        })
        initItemSelected();
    
    }, []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChange", index);
    }, []);

    const toggleItemSelect = useCallback((id: string) => {
        if (libraryIdListSelected.includes(id)) {
            setLibraryIdListSelected(prevIds => prevIds.filter(itemId => itemId !== id));
            console.log("removed :", id)

        } else {
            setLibraryIdListSelected(prevIds => [...prevIds, id]);
            console.log("added :", id)

        }
        console.log(libraryIdListSelected)
    }, [libraryIdListSelected]);

    function initItemSelected() {
        libraryRepository.getAllLibraryFromBook(idBookAdded).then((bookLibraryList) => {
            // console.log(bookLibraryList.map(library => library.id_library));
            
            setLibraryIdListSelected(bookLibraryList.map(library => library.id_library));
        })
    }

    const renderItem = useCallback(
        ({ item }: { item: Library }) => (
            <TouchableOpacity
                onPress={() => toggleItemSelect(item.id_library)}
                style={[{
                    backgroundColor: libraryIdListSelected.includes(item.id_library) ? 'lightgray' : 'white'

                }, styles.itemContainer]}
            >
                <Avatar.Icon size={24} style={styles.avatarStyle} icon="library" />
                <View >
                    <Text variant="titleMedium">{item.name}</Text>
                    <Text variant="bodyMedium">Livres présents : 10</Text>
                </View>
            </TouchableOpacity>
        ), [libraryIdListSelected]
    );

    const addToLibrary = async (id_library: string, id_book: string) => {
        await bookRepository.updateBookLibrary(id_library, id_book);
        console.log("book added");

    };

    const deleteFromLibrary = async (id_library: string, id_book: string) => {
        await bookRepository.delBookFromLibrary(id_library, id_book);
        console.log("book removed");
    };

    const confirmChoice = useCallback(async () => {

        console.log("Library to add :", libraryIdListSelected)

        for (const library of libraryList) {
            if (libraryIdListSelected.includes(library.id_library)) {
                addToLibrary(library.id_library, idBookAdded)
            } else {
                deleteFromLibrary(library.id_library, idBookAdded)
            }
        };
        
        closeModal();
    }, [libraryList, libraryIdListSelected])

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
                extraData={libraryIdListSelected}
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
