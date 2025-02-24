import { BottomSheetModal, BottomSheetModalProps, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import { useTheme } from "react-native-paper";
import { InternalOpacityBackdrop } from "./InternalOpacityBackdrop";
import { MAX_HEIGHT } from "./constant";
import { styles } from "./styles";

// FIXME: InternalOpacityBackdrop

export interface CustomBottomSheetProps extends Omit<BottomSheetModalProps, "children"> {
    children?: React.ReactNode[] | React.ReactNode;
}

export const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(({
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
            // stackBehavior="push"
            backdropComponent={InternalOpacityBackdrop}
            {...bottomSheetProps}
        >
            <BottomSheetView style={styles.containerSheet}>
                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
});
