import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React from "react";
import { Button } from "react-native-paper";
import { styles } from "./styles";

export const AddAccountFooter = () => {
    const router = useRouter();
    const { dismissAll } = useBottomSheetModal();

    const handleAddAccount = () => {
        dismissAll();
        router.push("/SignIn");
    };

    return (
        <Button mode="outlined" onPress={handleAddAccount} style={styles.footerContainer}>Add Account</Button>
    );
}
