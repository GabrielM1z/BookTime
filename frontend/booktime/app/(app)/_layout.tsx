import { useAuthContext } from "@/contexts/AuthContext";
import { BookProvider } from "@/contexts/BookContext";
import { Session } from "@/models";
import commonStyles from "@/styles/commonStyles";
import { Redirect, Stack } from "expo-router";
import React from 'react';
import { ActivityIndicator, View } from "react-native";
import 'react-native-reanimated';
import { useUserContext } from "@/contexts/UserContext";
// import { AppBar } from "@/components/navigation/AppBar";

const AuthenticatedLayout = (session: Session) => {
    const userController = useUserContext();
    userController.addFromSession(session);

    return (
        <BookProvider id_user={session.id_user}>
            <Stack screenOptions={{ headerShown: false, animation: 'fade'}}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="author/[idAuthor]" />
                <Stack.Screen name="book/[idBook]" />
                <Stack.Screen name="shelf/[idShelf]" />
                <Stack.Screen name="settings" options={{ headerShown: true }} />
            </Stack>
        </BookProvider>
    );
}

const AppLayout = () => {
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
        <AuthenticatedLayout {...session} />
    );
}

export default AppLayout;
