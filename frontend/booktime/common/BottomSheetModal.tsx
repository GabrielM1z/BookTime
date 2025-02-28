import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetProps } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export interface BottomSheetModalProps extends BottomSheetProps { }

export const BottomSheetModal = ({
    children,
    style,
    ...bottomSheetProps
}: BottomSheetModalProps) => {
    const { colors } = useTheme();
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            router.back();
        }
    }, [router]);

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            enableTouchThrough={false}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[{ backgroundColor: colors.backdrop }, StyleSheet.absoluteFillObject]}
        />
    ), [colors]);

    const sheetContainerStyle = useMemo(() => [
        styles.sheetContainer,
        style
    ], [style]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            style={sheetContainerStyle}
            bottomInset={8}
            enableDynamicSizing={true}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            detached={true}
            enablePanDownToClose={true}
            {...bottomSheetProps}
        >
            {children}
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {

    }
});
