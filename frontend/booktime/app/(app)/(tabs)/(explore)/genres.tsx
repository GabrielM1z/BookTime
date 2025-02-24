import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Text } from "react-native-paper";

const GenresTab = () => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Genres</Text>
        </SafeAreaView>
    );
}

export default GenresTab;
