import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

export interface ButtonsTopTabbarProps extends MaterialTopTabBarProps {
    addTopEdge?: boolean;
    style?: StyleProp<ViewStyle>;
};

export const ButtonsTopTabbar: React.FC<ButtonsTopTabbarProps> = ({
    state,
    descriptors,
    navigation,
    style,

    addTopEdge = false,
}) => {
    const { colors } = useTheme();

    const scrollRef = useRef<ScrollView>(null);
    const buttonRefs = useRef<{ [key: string]: View | null }>({});

    const edges: Edge[] = [];
    if (addTopEdge) {
        edges.push('top');
    }

    const scrollToActiveTab = (index: number) => {
        const route = state.routes[index];
        const button = buttonRefs.current[route.key];

        if (button && scrollRef.current) {
            button.measure((x, y, width, height, pageX) => {
                scrollRef.current?.scrollTo({
                    x: pageX - 20, // Décale légèrement pour le centrer mieux
                    animated: true,
                });
            });
        }
    };

    // useEffect(() => {
    //     scrollToActiveTab(state.index);
    // }, [state.index]);

    return (
        <SafeAreaView edges={edges} style={style}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
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
                        >
                            {label as string}
                        </Button>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
})