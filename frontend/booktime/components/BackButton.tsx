import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

export default function BackButton() {
    const router = useRouter();

    useEffect(() => {
        // console.log("router state:", window.history.length);
    }, []);

    return (
        <TouchableOpacity style={styles.backButton} onPress={() =>router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    backButton: {
        backgroundColor: "#333",
        padding: 10,
        borderRadius: 50,
    },
});

