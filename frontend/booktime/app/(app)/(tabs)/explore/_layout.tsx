import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

const TopTabs = createMaterialTopTabNavigator();

const ExploreTopTabsLayout = () => {
    return (
        <TopTabs.Navigator>
            <TopTabs.Screen name="feed" options={{ title: 'Feed' }} />
            <TopTabs.Screen name="genres" options={{ title: 'Genres' }} />
        </TopTabs.Navigator>
    );
}

export default ExploreTopTabsLayout;
