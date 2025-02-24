import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ animation: 'fade' }}>
            <Stack.Screen name="SignIn" options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        </Stack>
    )
}
