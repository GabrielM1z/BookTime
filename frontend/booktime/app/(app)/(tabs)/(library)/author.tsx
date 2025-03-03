import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Text } from "react-native-paper";

const AuthorTab = () => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Author</Text>
        </SafeAreaView>
    );
}

export default AuthorTab;
