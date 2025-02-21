import { BottomSheetBackdropProps, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { TouchableOpacity } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { styles } from "./styles";
import { useTheme } from "react-native-paper";

export const OpacityBackdropBottomSheet = ({ animatedIndex, animatedPosition, style }: BottomSheetBackdropProps) => {
    const { dismiss } = useBottomSheetModal();
    const { colors } = useTheme();

    // animated variables
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [0, 1], [0.6, 0], Extrapolation.CLAMP),
    }));

    // styles
    const containerStyle = useMemo(
        () => [
            style,
            styles.backdropSheet,
            { backgroundColor: colors.backdrop },
            containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle]
    );

    return (
        <Animated.View style={containerStyle}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => dismiss()} />
        </Animated.View>
    )
};
