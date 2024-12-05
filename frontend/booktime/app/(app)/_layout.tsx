import 'react-native-reanimated';

import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

import { useAuth } from "@/providers/auth";
import React from 'react';

export default function AppLayout() {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        return <Text>Chargement...</Text>;
    }

    if (!session && !session?.isGuest) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <Stack>
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='author/[idAuthor]' />
            <Stack.Screen name='book/[idBook]' />
        </Stack>
    );
}
