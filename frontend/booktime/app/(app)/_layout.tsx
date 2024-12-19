import 'react-native-reanimated';

import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import React from 'react';

export default function AppLayout() {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        return <Text>Chargement...</Text>;
    }

    if (!session) {
        return <Redirect href="/SignIn" />;
    }

    return (
        <Stack>

            <Stack.Screen
                name='(tabs)'
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='author/[idAuthor]'
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='book/[idBook]'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='settings'
                options={{ headerShown: true }}
            />
        </Stack>
    );
}
