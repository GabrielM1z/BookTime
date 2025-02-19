import React, { forwardRef, useCallback, useEffect } from "react";
import { BottomSheetModal, BottomSheetModalProps, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { MAX_HEIGHT } from "./constant";
import { styles } from "./styles";
import { OpacityBackdropBottomSheet } from "./OpacityBackdropBottomSheet";
import { BackHandler } from "react-native";


export interface CustomBottomSheetProps extends Omit<BottomSheetModalProps, "children"> {
    useOpacityBackdrop?: boolean;
    children?: React.ReactNode[] | React.ReactNode;
}

export const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
    ({ useOpacityBackdrop = true, children, ...bottomSheetProps }, ref) => {
        const { dismiss } = useBottomSheetModal();

        const handleBackPress = useCallback(() => {
            return dismiss();
        }, [dismiss]);

        useEffect(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => backHandler.remove();
        }, [handleBackPress]);

        return (
            <BottomSheetModal
                ref={ref}
                bottomInset={8}
                detached={true}
                style={styles.bottomSheet}
                maxDynamicContentSize={MAX_HEIGHT}
                backdropComponent={useOpacityBackdrop ? OpacityBackdropBottomSheet : undefined}
                {...bottomSheetProps}
            >
                <BottomSheetView style={styles.containerSheet}>
                    {children}
                </BottomSheetView>
            </BottomSheetModal>
        );
    });
