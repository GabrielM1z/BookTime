import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetProps
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const CustomBottomSheet = forwardRef<BottomSheet, BottomSheetProps>(({
    children,
    ...bottomSheetProps
}, ref) => {
    const { colors } = useTheme();

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
            ref={ref}
            containerStyle={styles.sheetContainer}
            backdropComponent={renderBackdrop}
            detached={true}
            backgroundStyle={{ backgroundColor: colors.surface }}
            {...bottomSheetProps}
        >
            {children}
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    sheetContainer: {
        margin: 8,
    }
});
