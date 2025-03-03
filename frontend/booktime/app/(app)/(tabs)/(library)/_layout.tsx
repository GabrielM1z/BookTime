import { ButtonsTopTabbar, MaterialTopTabs } from "@/common";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const LibraryTopTabsLayout = () => {
    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            <MaterialTopTabs
                tabBar={(props) => <ButtonsTopTabbar addTopEdge {...props} />}
                backBehavior="none"
                screenOptions={{
                    tabBarStyle: { paddingVertical: 10 },
                    swipeEnabled: false,
                }}
            >
                <MaterialTopTabs.Screen name="myShelves" options={{ title: 'My Shelves' }} />
                <MaterialTopTabs.Screen name="allBooks" options={{ title: 'All Books' }} />
                <MaterialTopTabs.Screen name="genre" options={{ title: 'Genre' }} />
                <MaterialTopTabs.Screen name="type" options={{ title: 'Type' }} />
                <MaterialTopTabs.Screen name="author" options={{ title: 'Author' }} />
            </MaterialTopTabs>
        </SafeAreaView>
    );
}

export default LibraryTopTabsLayout;
