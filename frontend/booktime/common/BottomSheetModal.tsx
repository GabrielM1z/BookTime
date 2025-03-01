import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetProps } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
//@ts-ignore
import { StackNavigationOptions } from "@react-navigation/stack";

export interface BottomSheetModalProps extends BottomSheetProps { }

export const BottomSheetModal = ({
    children,
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

    return (
        <BottomSheet
            ref={bottomSheetRef}
            containerStyle={styles.sheetContainer}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            detached={true}
            {...bottomSheetProps}
        >
            {children}
        </BottomSheet>
    );
};

export const BottomSheetModalScreenOptions: StackNavigationOptions = {
    headerShown: false,
    presentation: 'transparentModal',
    animation: 'none'
}

const styles = StyleSheet.create({
    sheetContainer: {
        margin: 8,
    }
});
