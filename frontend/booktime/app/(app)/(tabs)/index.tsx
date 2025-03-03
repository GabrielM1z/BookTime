import { useRootNavigationState, Redirect, Href } from 'expo-router';
import React from 'react';

export default function InitalRouting() {
    const rootNavigationState = useRootNavigationState();
    if (!rootNavigationState?.key) return null;

    return <Redirect href={'(library)' as Href} />
}
