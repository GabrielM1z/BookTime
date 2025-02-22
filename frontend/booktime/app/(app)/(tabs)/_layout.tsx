import { BubbleNavBar } from '@/components/navigation/BubbleNavBar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => (
                <BubbleNavBar
                    {...props}
                    renderIcon={(routeName, color) => {
                        switch (routeName) {
                            case 'library':
                                return <Feather name='book' color={color} size={24} />;
                            case 'search':
                                return <Feather name='search' color={color} size={24} />;
                            case 'news':
                                return <Feather name='mail' color={color} size={24} />;
                            case 'profile':
                                return <Feather name='user' color={color} size={24} />;
                        }
                    }}
                    excludeRoutes={['index']}
                />
            )}
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}>
            <Tabs.Screen name="library" options={{ title: 'Library' }} />
            <Tabs.Screen name="search" options={{ title: 'Search' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        </Tabs>
    );
}