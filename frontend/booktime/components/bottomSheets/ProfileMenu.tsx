import { Button } from "@/components/Button.component"
import { useAuthContext } from "@/contexts/AuthContext"
import { BottomSheetModal, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet"
import { Href, useRouter } from "expo-router"
import React, { forwardRef, useCallback, useRef } from "react"
import { AccountCenter, AddAccountFooter } from "./AccountCenter"
import { CustomBottomSheet } from "./CustomBottomSheet"
import { CustomBottomSheetProps } from "./CustomBottomSheet/CustomBottomSheet"


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
                <Button text='Settings' onPress={handleSettings} />
                <Button text='Account Center' onPress={handleAccountCenter} />
                <Button text='Log out' onPress={logOut} color='red' />
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
