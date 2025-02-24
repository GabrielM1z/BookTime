import { BottomSheetBackdropProps, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

export const OpacityBackdropBottomSheet = ({
    animatedIndex,
    style
}: BottomSheetBackdropProps) => {
    const { dismiss } = useBottomSheetModal();
    const { colors } = useTheme();

    // animated variables
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [-0.5, -1], [0.6, 0]),
    }));

    // styles
    const containerStyle = useMemo(
        () => [
            StyleSheet.absoluteFillObject,
            { backgroundColor: colors.backdrop },
            style,
            containerAnimatedStyle,
        ],
        [containerAnimatedStyle, colors]
    );

    return (
        <Animated.View style={containerStyle}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => dismiss()} />
        </Animated.View>
    )
};
