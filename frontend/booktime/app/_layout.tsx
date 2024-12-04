import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';

import { QueryProvider } from '@/components/QueryProvider';
import { SessionProvider } from "@/context/auth";
import React from 'react';
import { migrateDbIfNeeded } from '@/db/init';
import { deleteDatabaseAsync } from 'expo-sqlite';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const colorScheme = useColorScheme();

    // deleteDatabaseAsync('booktime.db');

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SQLiteProvider databaseName='booktime.db' onInit={migrateDbIfNeeded}>
                    <SessionProvider>
                        <QueryProvider>
                            <Stack>
                                <Stack.Screen name="(app)" options={{ headerShown: false }} />
                                <Stack.Screen name="(auth)" />
                                <Stack.Screen name="+not-found" />
                            </Stack>
                        </QueryProvider>
                    </SessionProvider>
                </SQLiteProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
