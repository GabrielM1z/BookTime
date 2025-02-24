import React, { useCallback, useRef, useMemo, forwardRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList, BottomSheetView } from "@gorhom/bottom-sheet";
import { CustomBottomSheet } from "@/common";
import { useRepositoryContext } from "@/hooks/useRepository";
import { Library } from "@/models";
import { Button } from 'react-native-paper';

interface ModalAddToLibraryProps {
    idBookAdded: string,
}

export const ModalAddToLibrary = forwardRef<BottomSheetModal, ModalAddToLibraryProps>(({ idBookAdded }, ref) => {
    // hooks
    // const ref = useRef<BottomSheetModal>(null);
    const [libraryList, setLibraryList] = useState<Library[]>([])
    const { libraryRepository } = useRepositoryContext();
    const [libraryIdListSelected, setLibraryIdListSelected] = useState<string[]>([])

    useEffect(() => {
        libraryRepository.getAll().then((data) => {
            console.log(data)
            setLibraryList(data)
        })
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


    const renderItem = useCallback(
        ({ item }: { item: Library }) => (
            <TouchableOpacity
                onPress={() => toggleItemSelect(item.id_library)}
                style={{
                    backgroundColor: libraryIdListSelected.includes(item.id_library) ? 'lightgray' : 'white'
                }}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        ), [libraryIdListSelected]
    );

    // const validChoice = useCallback(() => {
    //     return (
    //         <BottomSheetFooter>
    //             <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
    //                 Press me
    //             </Button>
    //         </BottomSheetFooter>
    //     )
    // }, [libraryIdListSelected])

    const Footer = ({ animatedFooterPosition }: BottomSheetFooterProps) => {
        return (
            <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
                <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
                    Press me
                </Button>
            </BottomSheetFooter>
        )
    }

    // const toggleItemSelect = useCallback((id: string) => {
    //     if (libraryIdListSelected.includes(id)) {
    //         setLibraryIdListSelected(prevIds => prevIds.filter(itemId => itemId !== id));
    //         console.log("removed :", id)

    //     } else {
    //         setLibraryIdListSelected(prevIds => [...prevIds, id]);
    //         console.log("added :", id)

    //     }
    //     console.log(libraryIdListSelected)
    // }, [libraryIdListSelected]);

    return (
        <BottomSheetModal
            ref={ref}
            onChange={handleSheetChanges}
            index={1}
            snapPoints={["25%", "50%", "90%"]} // <-- Définition des points d'ancrage
            enableDynamicSizing={false}
            footerComponent={Footer}
        >
            <BottomSheetFlatList
                style={styles.contentContainer}
                data={libraryList}
                extraData={libraryIdListSelected}
                renderItem={renderItem}
                keyExtractor={(i) => i.id_library} />

        </BottomSheetModal>
    );
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 200,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    sectionHeaderContainer: {
        backgroundColor: "white",
        padding: 6,
    },
    itemContainer: {
        // margin: "auto",
        padding: 10,
        backgroundColor: "#d73a49",
        alignItems: "center",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderColor: "#1e9aa4"
    },
});
