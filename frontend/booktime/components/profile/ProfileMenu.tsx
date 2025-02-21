import { CustomBottomSheet, CustomBottomSheetProps } from "@/common"
import { AccountCenter, AddAccountFooter } from "@/components/AccountCenter"
import { useAuthContext } from "@/contexts/AuthContext"
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet"
import { Href, useRouter } from "expo-router"
import React, { forwardRef, useCallback, useRef } from "react"
import { Button } from "react-native-paper"

export interface ProfileMenuProps extends Omit<CustomBottomSheetProps, "children"> { }

export const ProfileMenu = forwardRef<BottomSheetModal, ProfileMenuProps>((props, ref) => {
    const router = useRouter();
    const { dismiss } = useBottomSheetModal();
    const { logOut } = useAuthContext();

    const accountCenterRef = useRef<BottomSheetModal>(null);

    const handleAccountCenter = useCallback(() => {
        accountCenterRef.current?.present();
    }, [accountCenterRef]);

    const handleSettings = useCallback(() => {
        dismiss();
        router.push('/settings' as Href<"settings">);
    }, [router]);

    return (
        <>
            <CustomBottomSheet ref={ref} {...props}>
                <Button mode='outlined' onPress={handleSettings}>Settings</Button>
                <Button mode='outlined' onPress={handleAccountCenter}>Account Center</Button>
                <Button mode='contained' onPress={logOut} buttonColor="red">Log out</Button>
            </CustomBottomSheet>
            <AccountCenter
                ref={accountCenterRef}
                footer={AddAccountFooter}
                selectCurrentUser={true}
                useOpacityBackdrop={false}
            />
        </>
    );
});
