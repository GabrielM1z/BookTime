import { useAuth } from "@/hooks/useAuth";
import commonStyles from "@/styles/commonStyles";
import { Redirect, Stack } from "expo-router";
import React from 'react';
import { ActivityIndicator, View } from "react-native";
import 'react-native-reanimated';

export default function AppLayout() {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={commonStyles.loadingOverlay}>
                <ActivityIndicator size="large" color="#25a9e2" />
            </View>
        );
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
                name='etagere/[idEtagere]'
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='settings'
                options={{ headerShown: true }}
            />
        </Stack>
    );
}
