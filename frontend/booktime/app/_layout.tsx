import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/components/QueryProvider';
import React from 'react';
import { migrateDbIfNeeded } from '@/db/init';
import { deleteDatabaseAsync } from 'expo-sqlite';
import { RepositoryProvider } from '@/providers/RepositoryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiWrapper } from '@/services/api';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const colorScheme = useColorScheme();

    // deleteDatabaseAsync('booktime.db');
    AsyncStorage.clear();

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
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <AuthProvider>
                            <RepositoryProvider databaseName='booktime.db' onInit={migrateDbIfNeeded} onError={handleSQLiteError}>
                                <ApiWrapper>
                                    <QueryProvider>
                                        <Stack>
                                            <Stack.Screen name="(app)" options={{ headerShown: false }} />
                                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                                            <Stack.Screen name="+not-found" />
                                        </Stack>
                                    </QueryProvider>
                                </ApiWrapper>
                            </RepositoryProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
