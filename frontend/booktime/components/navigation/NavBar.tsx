import React, { useMemo, useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#130057";
const SECONDARY_COLOR = "#fff";

export interface NavBarProps extends BottomTabBarProps {
    renderIcon?: (routeName: string, color: string) => React.ReactNode;
    excludeRoutes?: string[];

    state: any;
    descriptors: any;
    navigation: any;
}

const defaultRenderIcon = (iconName: keyof typeof Feather.glyphMap, color: string) => (
    <Feather name={iconName} size={18} color={color} />
)

export const NavBar: React.FC<NavBarProps> = ({
    renderIcon,
    excludeRoutes = [],
    state,
    descriptors,
    navigation,
}) => {
    const tabPositionX = useSharedValue(0);
    const tabWidth = useSharedValue(0);

    const bubbleAnimation = useAnimatedStyle(() => {
        return {
            width: tabWidth.value,
            left: tabPositionX.value
        }
    });

    const bubbleStyle = useMemo(() => [styles.bubble, bubbleAnimation], [bubbleAnimation]);

    return (
        <View style={styles.container}>
            <Animated.View style={bubbleStyle} />
            {state.routes.map((route: any, index: number) => {
                if (excludeRoutes.includes(route.name)) return null;

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

                const onLayout = (event: any) => {
                    if (focused) {
                        tabPositionX.value = withSpring(event.nativeEvent.layout.x, { duration: 1000, dampingRatio: 0.8 });
                        tabWidth.value = withTiming(event.nativeEvent.layout.width, { duration: 100 });
                    }
                }

                return (
                    <AnimatedTouchableOpacity
                        layout={LinearTransition.springify().mass(0.5)}
                        key={route.key}
                        onLayout={onLayout}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        {(renderIcon || defaultRenderIcon)(
                            route.name,
                            focused ? PRIMARY_COLOR : SECONDARY_COLOR
                        )}
                        {focused && (
                            <Animated.Text
                                entering={FadeIn.duration(200)}
                                exiting={FadeOut.duration(200)}
                                style={styles.text}
                            >
                                {label as string}
                            </Animated.Text>
                        )}
                    </AnimatedTouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: PRIMARY_COLOR,
        width: "80%",
        alignSelf: "center",
        bottom: 16,
        borderRadius: 18,
        paddingVertical: 8,
        gap: 8,
    },
    tabItem: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 36,
        paddingHorizontal: 8,
    },
    bubble: {
        position: "absolute",
        height: 36,
        borderRadius: 10,
        backgroundColor: SECONDARY_COLOR,
    },
    text: {
        color: PRIMARY_COLOR,
        marginLeft: 8,
        fontWeight: "500",
    },
});
