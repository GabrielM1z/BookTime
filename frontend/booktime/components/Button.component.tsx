import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

// TODO: Theming

export interface ButtonProps {
    onPress?: () => void;
    color?: string;
    text: string;
}

export const Button = (props: ButtonProps) => {
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: props.color ?? 'blue' }]} onPress={props.onPress}>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        // marginHorizontal: 8,
        // marginBottom: 8,
    },
    text: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
})
