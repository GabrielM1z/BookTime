import { QueryProvider } from '@/components/QueryProvider';
import { migrateDbIfNeeded } from '@/db/init';
import { testServeur } from '@/helpers/testServeur';
import { useAuthInterceptor } from '@/hooks/useAuthInterceptor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { FadeTransitionProvider } from '@/contexts/FadeTransitionContext';
import { ControllerProvider } from '@/providers/ControllerProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { deleteDatabaseAsync } from 'expo-sqlite';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Routes() {
    useAuthInterceptor();

    return (
        <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const colorScheme = useColorScheme();

    // deleteDatabaseAsync('booktime.db');
    // AsyncStorage.clear();

    const test = async () => {
        await testServeur();
    }

    useEffect(() => {
        test();
    }, []);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    const handleSQLiteError = (error: Error) => {
        throw error;
    }

    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <ControllerProvider databaseName='booktime.db' onInit={migrateDbIfNeeded} onError={handleSQLiteError}>
                            <AuthProvider>
                                <QueryProvider>
                                    <FadeTransitionProvider>
                                        <Routes />
                                    </FadeTransitionProvider>
                                </QueryProvider>
                            </AuthProvider>
                        </ControllerProvider>
                    </ThemeProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
