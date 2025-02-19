import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { ProfileItem } from "./ProfileItem";
import { Button } from "@/components/Button.component";


export const AddAccountFooter = () => {
    const router = useRouter();
    const { dismissAll } = useBottomSheetModal();

    const handleAddAccount = useCallback(() => {
        dismissAll();
        router.push("/SignIn");
    }, [dismissAll, router]);

    return (
        // <ProfileItem
        //     id="add-account"
        //     text="Add Account"
        //     image={<Ionicons name="add-circle" size={32} color="blue" />}
        //     onItemClicked={handleAddAccount}
        //     isSelected={false}
        // />
        <Button text="Add Account" onPress={handleAddAccount} color="blue" />
    );
}
