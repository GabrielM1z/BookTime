import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Text } from "react-native-paper";

const GenreTab = () => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Genre</Text>
        </SafeAreaView>
    );
}

export default GenreTab;
