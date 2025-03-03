import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text, TextProps } from "react-native-paper";

export interface PressableTextProps extends TextProps<string> {
    onPress?: () => void;
}

export const PressableText = ({
    onPress,
    ...textProps
}: PressableTextProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text {...textProps} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    }
})
