import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useGoodThemeColor, useThemeColor } from "@/hooks/useThemeColor";

interface LibraryChipProps {
    title: string;
    onDelete: () => void;
}



// Composant pour les chips de bibliothèque
export default function LibraryChip({ title, onDelete }){

    const color = useGoodThemeColor('secondary');

    return (
        <View style={[styles.chip, { backgroundColor: color }]}>
            <ThemedText style={styles.chipText}>{title}</ThemedText>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <ThemedText style={styles.deleteText}>✖</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 10,
        margin: 5,
    },
    chipText: {
        marginRight: 10,
    },
    deleteButton: {
        padding: 5,
    },
    deleteText: {
        color: 'red',
        fontSize: 16,
    },
});


export { LibraryChip };