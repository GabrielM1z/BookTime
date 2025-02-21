import { NavBar } from '@/components/navigation/NavBar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';




export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            tabBar={(props) => (
                <NavBar
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
                // tabBarActiveTintColor: Colors.dark.text,
                // tabBarInactiveTintColor: Colors.dark.textMuted,
            }}>
            <Tabs.Screen name="library" options={{ title: 'Bibliothèque' }} />
            <Tabs.Screen name="search" options={{ title: 'Rechercher' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        </Tabs>
    );
}