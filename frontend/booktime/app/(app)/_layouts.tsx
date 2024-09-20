import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import { Link, Stack, Redirect } from "expo-router";
import { Platform, Pressable, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useSession } from "@/context/auth";

// export const unstable_settings = {
//   initialRouteName: "index",
// };


export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

