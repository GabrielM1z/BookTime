import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Text } from "react-native-paper";

const FeedTab = () => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Feed</Text>
        </SafeAreaView>
    );
}

export default FeedTab;
