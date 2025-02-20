import React, { useCallback, useRef, useMemo, forwardRef } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList, BottomSheetView } from "@gorhom/bottom-sheet";

export const ModalAddToLibrary = forwardRef<BottomSheetModal>((_props, ref) => {
    // hooks
    // const ref = useRef<BottomSheetModal>(null);

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
    const handleSheetChange = useCallback((index: number) => {
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
        ({ item }: { item: string }) => (
            <View style={styles.itemContainer}>
                <Text>{item}</Text>
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
            <BottomSheetModal
                ref={ref}
                index={-1}
                snapPoints={["25%", "50%", "90%"]}
                enableDynamicSizing={false}
                onChange={handleSheetChange}
            
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text>Awesome 🎉</Text>
                </BottomSheetView>
                <BottomSheetSectionList
                    sections={sections}
                    keyExtractor={(i) => i}
                    renderSectionHeader={renderSectionHeader}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contentContainer}
                />
            </BottomSheetModal>
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
