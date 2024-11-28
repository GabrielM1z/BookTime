import 'react-native-reanimated';

import { Link, Stack, Redirect, Href } from "expo-router";
import { Platform, Pressable, Text } from "react-native";

import { useSession } from "@/context/auth";
import React from 'react';

// export const unstable_settings = {
//   initialRouteName: "index",
// };


export default function AppLayout() {

  const { session, isGuest, isLoading } = useSession();

  if (isLoading) {
    return <Text>Chargement...</Text>;
  }

  if (!session && !isGuest) {
    return <Redirect href={"/sign-in" as Href} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

