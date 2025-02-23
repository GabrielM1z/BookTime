import { useAuthContext } from "@/contexts/AuthContext";
import commonStyles from "@/styles/commonStyles";
import { Redirect, Stack } from "expo-router";
import React from 'react';
import { ActivityIndicator, View } from "react-native";
import 'react-native-reanimated';

export default function AppLayout() {
    const { session, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <View style={commonStyles.loadingOverlay}>
                <ActivityIndicator size="large" color="#25a9e2" />
            </View>
        );
    }

    if (!session) {
        return <Redirect href="/SignIn?showSessions=true" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='author/[idAuthor]' />
            <Stack.Screen name='book/[idBook]' />
            <Stack.Screen name='etagere/[idEtagere]' />
            <Stack.Screen
                name='settings'
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name='search'
                options={{ animation: 'fade' }}
            />
        </Stack>
    );
}
