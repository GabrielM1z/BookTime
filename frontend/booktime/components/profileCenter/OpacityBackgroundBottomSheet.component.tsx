import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, {  } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";

export interface OpacityBackgroundBottomSheetProps {
    modalIndex: SharedValue<number>;
}

export const OpacityBackgroundBottomSheet = (props: OpacityBackgroundBottomSheetProps) => {
    const { dismiss } = useBottomSheetModal();

    // Style animé pour l'overlay avec effet d'opacité
    const overlayAnimatedStyle = useAnimatedStyle(() => {
        console.log('props.isModalOpen.value', props.modalIndex.value);
        const cond = props.modalIndex.value !== -1;
        return {
            opacity: cond ? 0.6 : 0,
            zIndex: cond ? 10 : -1,
        };
    }, [props.modalIndex]);

    return (
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
            {props.modalIndex && (
                <TouchableOpacity style={{ flex: 1 }} onPress={() => dismiss()} />
            )}
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


