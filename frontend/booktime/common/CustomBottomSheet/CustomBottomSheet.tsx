import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetModalProps, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { InternalOpacityBackdrop } from "./InternalOpacityBackdrop";
import { styles, MAX_HEIGHT } from "./styles";

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

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            enableTouchThrough={false}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[{ backgroundColor: colors.backdrop }, StyleSheet.absoluteFillObject]}
        />
    ), []);

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
            backdropComponent={renderBackdrop}
            {...bottomSheetProps}
        >
            {children}
        </BottomSheetModal>
    );
});
