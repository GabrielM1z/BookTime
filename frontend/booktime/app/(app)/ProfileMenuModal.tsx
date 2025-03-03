import { BottomSheetModal } from "@/common";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Href, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Button, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

const ProfileMenuModal = () => {
    const router = useRouter();
    const { colors } = useTheme();
    const { logOut, session } = useAuthContext();
    const { userController } = useUserContext();

    const handleAccountCenter = useCallback(() => {
        router.back();
        router.push({ pathname: '/AccountCenterModal', params: { showGuest: "true", addAccount: "true", selectCurrent: "true" } });
    }, [router]);

    const handleSettings = useCallback(() => {
        router.push('/settings' as Href);
    }, [router]);

    const handleLogOut = async () => {
        logOut();
        await userController.user.delete(session!.id_user);
    }

    return (
        <BottomSheetModal enableDynamicSizing maxDynamicContentSize={300}>
            <BottomSheetView style={styles.container}>
                <Button mode='outlined' onPress={handleSettings}>Settings</Button>
                <Button mode='outlined' onPress={handleAccountCenter}>Account Center</Button>
                <Button mode='contained' onPress={handleLogOut} buttonColor={colors.error} textColor={colors.onError}>
                    Log out
                </Button>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        padding: 8,
    },
});

export default ProfileMenuModal;
