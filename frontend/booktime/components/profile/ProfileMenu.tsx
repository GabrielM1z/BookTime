import { CustomBottomSheet, CustomBottomSheetProps } from "@/common"
import { AccountCenter } from "@/components/AccountCenter"
import { useAuthContext } from "@/contexts/AuthContext"
import { useUserContext } from "@/contexts/UserContext"
import { BottomSheetModal, useBottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { Href, useRouter } from "expo-router"
import React, { forwardRef, useCallback, useRef } from "react"
import { View } from "react-native"
import { Button, useTheme } from "react-native-paper"

export interface ProfileMenuProps extends Omit<CustomBottomSheetProps, "children"> { }

export const ProfileMenu = forwardRef<BottomSheetModal, ProfileMenuProps>((props, ref) => {
    const router = useRouter();
    const { colors } = useTheme();
    const { dismiss } = useBottomSheetModal();
    const { logOut, session } = useAuthContext();
    const userController = useUserContext();

    const accountCenterRef = useRef<BottomSheetModal>(null);

    const handleAccountCenter = useCallback(() => {
        accountCenterRef.current?.present();
    }, [accountCenterRef]);

    const handleSettings = useCallback(() => {
        dismiss();
        router.push('/settings' as Href);
    }, [router]);

    const handleLogOut = async () => {
        logOut();
        await userController.user.delete(session!.id_user);
    }

    return (
        <>
            <CustomBottomSheet ref={ref} {...props}>
                <BottomSheetView>
                    <View style={{ gap: 8 }}>
                        <Button mode='outlined' onPress={handleSettings}>Settings</Button>
                        <Button mode='outlined' onPress={handleAccountCenter}>Account Center</Button>
                        <Button mode='contained' onPress={handleLogOut} buttonColor={colors.error} textColor={colors.onError}>
                            Log out
                        </Button>
                    </View>
                </BottomSheetView>
            </CustomBottomSheet>
            <AccountCenter ref={accountCenterRef} selectCurrentUser={true} addAccountFooter />
        </>
    );
});
