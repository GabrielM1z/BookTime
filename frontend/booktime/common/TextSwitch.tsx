import { Switch, SwitchProps, Text } from 'react-native-paper';
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export interface TextSwitchProps extends SwitchProps {
    children: string;
}

export const TextSwitch = ({ children, ...switchProps }: TextSwitchProps) => {
    return (
        <View style={styles.container}>
            <Switch
                {...switchProps}
            />
            <Text>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
});
