import { withAnimated } from "@/common";
import { Feather } from "@expo/vector-icons";
import Color from "color";
import { BottomTabBarProps } from "expo-router/node_modules/@react-navigation/bottom-tabs";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedText = withAnimated(Text);

export interface NavBarProps extends BottomTabBarProps {
    renderIcon?: (routeName: string, color: string) => React.ReactNode;
    excludeRoutes?: string[];
}

const defaultRenderIcon = (iconName: keyof typeof Feather.glyphMap, color: string) => (
    <Feather name={iconName} size={18} color={color} />
)

export const BubbleNavBar: React.FC<NavBarProps> = ({
    renderIcon,
    excludeRoutes = [],
    state,
    descriptors,
    navigation,
}) => {
    const { colors } = useTheme();
    const tabPositionX = useSharedValue(0);
    const tabWidth = useSharedValue(0);

    const bubbleAnimation = useAnimatedStyle(() => {
        return {
            width: tabWidth.value,
            left: tabPositionX.value,
        }
    });

    const bubbleStyle = useMemo(() => [
        styles.bubble,
        { backgroundColor: colors.surfaceVariant },
        bubbleAnimation
    ], [bubbleAnimation, colors]);

    const tabBarStyle = useMemo(() => [
        styles.container,
        {
            backgroundColor: colors.elevation.level2,
            borderTopColor: colors.outline
        }], [colors]);

    return (
        <View style={tabBarStyle}>
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

                const color = focused ? colors.primary : Color(colors.onSurface).mix(Color(colors.elevation.level2), 0.5).hex();

                return (
                    <AnimatedTouchableOpacity
                        layout={LinearTransition.springify().mass(0.5)}
                        key={route.key}
                        onLayout={onLayout}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        {(renderIcon || defaultRenderIcon)(route.name, color)}
                        {focused && (
                            <AnimatedText
                                entering={FadeIn.duration(200)}
                                exiting={FadeOut.duration(200)}
                                style={[styles.text, { color }]}
                            >
                                {label as string}
                            </AnimatedText>
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
        width: "80%",
        alignSelf: "center",
        bottom: 16,
        borderRadius: 18,
        paddingVertical: 8,
        gap: 24,
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
    },
    text: {
        marginLeft: 8,
    },
});
