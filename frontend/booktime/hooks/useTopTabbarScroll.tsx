import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useTopTabbarScroll = (paddingTop: number) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [scrollViewPageY, setScrollViewPageY] = useState(paddingTop); // FIXME: padding top
    const [scrollUnder, setScrollUnder] = useState(false);

    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const contentOffsetY = event.nativeEvent.contentOffset.y;
            const under = contentOffsetY > scrollViewPageY;

            if (under !== scrollUnder) {
                setScrollUnder(under);
                navigation.setOptions({
                    tabBarScrollUnder: under,
                });
            }
        },
        [navigation, scrollViewPageY, colors, scrollUnder]
    );

    return {
        handleScroll,
    };
};
