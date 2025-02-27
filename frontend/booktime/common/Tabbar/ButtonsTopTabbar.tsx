import { MaterialTopTabBarProps, MaterialTopTabNavigationOptions, MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { Descriptor, ParamListBase, RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ButtonsTopTabbarOptions extends MaterialTopTabNavigationOptions {
    tabBarScrollUnder?: boolean;
    tabBarScrollUnderStyle?: (scrollUnder: boolean) => ViewStyle;
}

export interface ButtonsTopTabbarProps extends Omit<MaterialTopTabBarProps, 'descriptors'> {
    addTopEdge?: boolean;
    style?: StyleProp<ViewStyle>;
    descriptors: Record<
        string,
        Descriptor<
            ButtonsTopTabbarOptions,
            MaterialTopTabNavigationProp<ParamListBase>,
            RouteProp<ParamListBase>
        >
    >;
};

export const ButtonsTopTabbar: React.FC<ButtonsTopTabbarProps> = ({
    state,
    descriptors,
    navigation,
    addTopEdge = false,
}) => {
    const { colors } = useTheme();

    const focusedOptions = descriptors[state.routes[state.index].key].options;
    const tabBarScrollUnder = focusedOptions.tabBarScrollUnder;
    const tabBarScrollUnderStyle = focusedOptions.tabBarScrollUnderStyle;
    const tabBarStyle = focusedOptions.tabBarStyle;

    const insets = useSafeAreaInsets();
    const scrollRef = useRef<ScrollView>(null);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const buttonRefs = useRef<{ [key: string]: View | null }>({});

    const scrollToActiveTab = useCallback(
        (index: number) => {
            const route = state.routes[index];
            const button = buttonRefs.current[route.key];

            if (button && scrollRef.current && scrollViewWidth > 0 && contentWidth > 0) {
                button.measure((x, y, width, height, pageX) => {
                    const centerPosition = x + width / 2 - scrollViewWidth / 2;
                    const clampedPosition = Math.max(0, Math.min(centerPosition, scrollViewWidth));

                    scrollRef.current?.scrollTo({
                        x: clampedPosition,
                        animated: true,
                    });
                });
            }
        },
        [scrollViewWidth, contentWidth, state.routes]
    );

    useEffect(() => {
        scrollToActiveTab(state.index);
    }, [state.index, scrollViewWidth]);

    // FIXME: le shadow ne sapplique plus lorsqu'on change de page 
    const animatedTabbarStyle = useAnimatedStyle(() => {
        if (tabBarScrollUnder && tabBarScrollUnderStyle) {
            return tabBarScrollUnderStyle(tabBarScrollUnder);
        }
        return {
            backgroundColor: withTiming(tabBarScrollUnder ? colors.surfaceVariant : colors.surface, { duration: 200 }),
            shadowColor: withTiming(tabBarScrollUnder ? colors.shadow : 'transparent', { duration: 100 }),
            elevation: withTiming(tabBarScrollUnder ? 5 : 0, { duration: 100 }),
        };
    }, [tabBarScrollUnder, tabBarScrollUnderStyle]);

    const tabbarStyle = useMemo(
        () => ([
            // { paddingLeft: insets.left, paddingRight: insets.right },
            // addTopEdge && { paddingTop: insets.top },
            tabBarStyle,
            animatedTabbarStyle
        ]),
        [tabBarStyle, animatedTabbarStyle]
    );

    return (
        <Animated.View style={tabbarStyle}>
            <View style={[
                { paddingLeft: insets.left, paddingRight: insets.right },
                addTopEdge && { paddingTop: insets.top }
            ]}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    onLayout={(event: LayoutChangeEvent) => setScrollViewWidth(event.nativeEvent.layout.width)}
                    onContentSizeChange={(width) => setContentWidth(width)}
                >
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        const focused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        return (
                            <Button
                                key={route.key}
                                ref={(ref) => (buttonRefs.current[route.key] = ref)}
                                onLayout={(event: LayoutChangeEvent) => {
                                    buttonRefs.current[route.key] = event.target as View;
                                }}
                                mode="contained"
                                onPress={onPress}
                                buttonColor={focused ? colors.primary : colors.surfaceVariant}
                                textColor={focused ? colors.onPrimary : colors.onSurfaceVariant}
                                style={[styles.item, options.tabBarItemStyle]}
                            >
                                {label as string}
                            </Button>
                        );
                    })}
                </ScrollView>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 8,
        shadowOpacity: 0.2,
    },
    item: {
        marginHorizontal: 5,
    }
});
