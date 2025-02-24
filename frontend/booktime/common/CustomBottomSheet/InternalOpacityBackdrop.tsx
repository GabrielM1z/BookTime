import { BottomSheetBackdropProps, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useInternalBackdrop } from "./BottomSheetContext";
import { generateRandomKey } from "./utils";

export const InternalOpacityBackdrop = ({
    animatedIndex,
}: BottomSheetBackdropProps) => {
    const { dismiss } = useBottomSheetModal();
    const { colors } = useTheme();
    const { bottomSheetStack, addBottomSheet, removeBottomSheet } = useInternalBackdrop();

    const bottomSheetKey = useMemo(() => generateRandomKey(), []);

    // useEffect(() => {
    //     addBottomSheet(bottomSheetKey);
    //     return () => {
    //         removeBottomSheet(bottomSheetKey);
    //     };
    // }, [addBottomSheet, removeBottomSheet, bottomSheetKey]);

    const isTopMostBottomSheet = bottomSheetStack[bottomSheetStack.length - 1] === bottomSheetKey;

    // animated variables
    // const containerAnimatedStyle = useAnimatedStyle(() => ({
    //     opacity: isTopMostBottomSheet ? interpolate(animatedIndex.value, [-0.5, -1], [0.6, 0]) : 0,
    // }));
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [-0.5, -1], [0.6, 0]),
    }));

    // styles
    const containerStyle = useMemo(
        () => [
            StyleSheet.absoluteFillObject,
            { backgroundColor: colors.backdrop },
            containerAnimatedStyle,
        ],
        [containerAnimatedStyle, colors]
    );

    return (
        <Animated.View style={containerStyle}>
            {/* {isTopMostBottomSheet && <TouchableOpacity style={{ flex: 1 }} onPress={() => dismiss()} />} */}
            <TouchableOpacity style={{ flex: 1 }} onPress={() => dismiss()} />
        </Animated.View>
    );
};