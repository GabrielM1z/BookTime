import React, { useCallback, useRef, useMemo, forwardRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList, BottomSheetView } from "@gorhom/bottom-sheet";
import { CustomBottomSheet } from "@/common";
import { Library } from "@/models";
import { useController } from "@/hooks/useController";

export const ModalAddToLibrary = forwardRef<BottomSheetModal>((_props, ref) => {
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
    }, []); 


    // variables
    const sections = useMemo(
        () =>
            Array(10)
                .fill(0)
                .map((_, index) => ({
                    title: `Section ${index}`,
                    data: Array(10)
                        .fill(0)
                        .map((_, index) => `Item ${index}`),
                })),
        []
    );

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
        <>
            {/* <GestureHandlerRootView style={styles.container}>
                <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
                <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
                <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
                <Button title="Close" onPress={() => handleClosePress()} /> */}
            <CustomBottomSheet
                ref={ref}
                onChange={handleSheetChanges}
            // index={0}
            // snapPoints={["25%", "50%", "90%"]} // <-- Définition des points d'ancrage
            >
                <BottomSheetFlatList style={styles.contentContainer} data={libraryList} renderItem={renderItem}>
                    {/* <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text>
                    <Text>Awesome 🎉</Text> */}

                </BottomSheetFlatList>
            </CustomBottomSheet>
            {/* </GestureHandlerRootView> */}
        </>
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
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
    },
});
