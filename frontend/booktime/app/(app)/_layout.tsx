import 'react-native-reanimated';

import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

import { useSession } from "@/context/auth";
import React from 'react';

export default function AppLayout() {
    const { session, isLoading } = useSession();

    // if (isLoading) {
    //     return <Text>Chargement...</Text>;
    // }

    // if (!session && !session?.isGuest) {
    //     return <Redirect href="/sign-in" />;
    // }

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

        </Stack>
    );
}
