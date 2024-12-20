import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";

export interface OpacityBackgroundBottomSheetProps {
    isOpen: boolean[];
}

export const OpacityBackgroundBottomSheet = (props: OpacityBackgroundBottomSheetProps) => {
    const { dismiss } = useBottomSheetModal();

    const overlayAnimatedStyle = useAnimatedStyle(() => {
        const cond = props.isOpen.reduce((acc: boolean, value: boolean) => acc || value, false);
        return {
            opacity: cond ? 0.6 : 0,
            zIndex: cond ? 10 : -1,
        };
    }, [props.isOpen]);

    return (
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => dismiss()} />
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});


