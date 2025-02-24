// https://reactnativepro.dev/posts/expo-router-top-tabs

import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Href, useRouter, withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import React from "react";
import { ButtonsTopTabbar } from "@/common";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

const LibraryTopTabsLayout = () => {
    return (
        <MaterialTopTabs
            tabBar={(props) => <ButtonsTopTabbar addTopEdge style={{ padding: 10 }} {...props} />}
            backBehavior="none"
        >
            <MaterialTopTabs.Screen name="myShelf" options={{ title: 'My Shelf' }} />
            <MaterialTopTabs.Screen name="allBooks" options={{ title: 'All Books' }} />
            <MaterialTopTabs.Screen name="genre" options={{ title: 'Genre' }} />
            <MaterialTopTabs.Screen name="type" options={{ title: 'Type' }} />
            <MaterialTopTabs.Screen name="author" options={{ title: 'Author' }} />
        </MaterialTopTabs>
    );
}

export default LibraryTopTabsLayout;
