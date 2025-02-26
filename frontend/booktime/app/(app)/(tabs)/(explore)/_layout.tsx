// https://reactnativepro.dev/posts/expo-router-top-tabs

import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Href, useRouter, withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import React from "react";
import { SearchTabbar } from "@/components/explore/SearchTabbar";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

const ExploreTopTabsLayout = () => {
    const router = useRouter();

    const handleSearch = () => {
        router.push('search' as Href);
    }

    return (
        <MaterialTopTabs
            tabBar={(props) => <SearchTabbar onSearchPress={handleSearch} {...props} />}
            backBehavior="none"
        >
            <MaterialTopTabs.Screen name="feed" options={{ title: 'Feed' }} />
            <MaterialTopTabs.Screen name="genres" options={{ title: 'Genres' }} />
        </MaterialTopTabs>
    );
}

export default ExploreTopTabsLayout;
