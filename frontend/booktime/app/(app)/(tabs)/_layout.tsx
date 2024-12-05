import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBar } from '@/components/TabBar';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
            screenOptions={{
                tabBarActiveTintColor: Colors.dark.background,
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 27,
                    marginLeft: 16,
                    marginRight: 16,
                    elevation: 0,
                    borderRadius: 30,
                    alignItems: "center",
                    justifyContent: "center",
                }
            }}>
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Bibliothèque',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'library' : 'library-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Rechercher',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="news"
                options={{
                    title: 'Nouveauté',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'mail' : 'mail-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profil"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>

    );
}