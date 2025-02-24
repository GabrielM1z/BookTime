import { BottomSheetModal, BottomSheetModalProps, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import { useTheme } from "react-native-paper";
import { OpacityBackdropBottomSheet } from "./OpacityBackdropBottomSheet";
import { MAX_HEIGHT } from "./constant";
import { styles } from "./styles";

export interface CustomBottomSheetProps extends Omit<BottomSheetModalProps, "children"> {
    useOpacityBackdrop?: boolean;
    children?: React.ReactNode[] | React.ReactNode;
}

export const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(({
    useOpacityBackdrop = true,
    children,
    ...bottomSheetProps
}, ref) => {
    const { colors } = useTheme();
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
            bottomInset={16 + 8}
            detached={true}
            style={styles.bottomSheet}
            backgroundStyle={{ backgroundColor: colors.surface }}
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
