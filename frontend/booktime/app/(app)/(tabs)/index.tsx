import { useRootNavigationState, Redirect } from 'expo-router';
import React from 'react';

export default function InitalRouting() {
    const rootNavigationState = useRootNavigationState();
    if (!rootNavigationState?.key) return null;

    return <Redirect href={'/(app)/(tabs)/library'} />
}
