import React, { useCallback, useRef, useMemo, forwardRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList, BottomSheetView } from "@gorhom/bottom-sheet";
import { CustomBottomSheet } from "../bottomSheets/CustomBottomSheet";
import { useRepositoryContext } from "@/hooks/useRepository";
import { Library } from "@/models";

export const ModalAddToLibrary = forwardRef<BottomSheetModal>((_props, ref) => {
    // hooks
    // const ref = useRef<BottomSheetModal>(null);
    const [libraryList, setLibraryList] = useState<Library[]>([])
    const { libraryRepository } = useRepositoryContext();

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

    // render
    const renderSectionHeader = useCallback(
        ({ section }: { section: { title: string } }) => (
            <View style={styles.sectionHeaderContainer}>
                <Text>{section.title}</Text>
            </View>
        ),
        []
    );

    const renderItem = useCallback(
        ({ item }: { item: Library }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
          </View>
        ),
        []
      );
    return (
        <CustomBottomSheet
            ref={ref}
            onChange={handleSheetChanges}
            index={1}
            snapPoints={["25%", "50%", "90%"]} // <-- Définition des points d'ancrage
            enableDynamicSizing={false}
        >
            <BottomSheetFlatList
                style={styles.contentContainer}
                data={libraryList}
                renderItem={renderItem}
                keyExtractor={(i) => i.id_library}/>
        </CustomBottomSheet>
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
        height: 10,
        backgroundColor: "#d73a49",
    },
});
