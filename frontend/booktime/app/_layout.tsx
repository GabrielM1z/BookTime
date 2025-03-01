import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { migrateDbIfNeeded } from '@/db/init';
import { useAuthInterceptor } from '@/hooks/useAuthInterceptor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CustomBottomSheetProvider } from "@/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme, ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider, deleteDatabaseAsync } from 'expo-sqlite';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, adaptNavigationTheme, useTheme } from 'react-native-paper';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/contexts/UserContext';
import { BottomSheetModalScreenOptions } from '@/common';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

function Routes() {
    useAuthInterceptor();
    const { colors } = useTheme();

    return (
        <UserProvider>
            <Stack screenOptions={{ headerShown: false, navigationBarColor: colors.surface }}>
                <Stack.Screen name="(app)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="AccountCenterModal" options={BottomSheetModalScreenOptions} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </UserProvider>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const colorScheme = useColorScheme();

    // deleteDatabaseAsync('booktime.db');
    // AsyncStorage.clear();

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
        <PaperProvider>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <StatusBar style="auto" />
                <GestureHandlerRootView>
                    <CustomBottomSheetProvider>
                        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
                            <QueryProvider>
                                <SQLiteProvider databaseName='booktime.db' onInit={migrateDbIfNeeded} onError={handleSQLiteError}>
                                    <AuthProvider>
                                        <Routes />
                                    </AuthProvider>
                                </SQLiteProvider>
                            </QueryProvider>
                        </ThemeProvider>
                    </CustomBottomSheetProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </PaperProvider>
    );
}
