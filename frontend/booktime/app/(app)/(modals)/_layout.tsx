import { BottomSheetNavigator } from "@/common";
import React, { useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from 'react-native-paper';
import { StyleSheet } from "react-native";

const BottomSheetLayout = () => {
    const { colors } = useTheme();

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

    return (
        <BottomSheetNavigator screenOptions={{
            backdropComponent: renderBackdrop,
            enableDynamicHeight: true,
            detached={true}
        }}>
            <BottomSheetNavigator.Screen />
        </BottomSheetNavigator>
    );
}

export default BottomSheetLayout;
