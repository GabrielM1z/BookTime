import React from "react"
import { TouchableOpacity, View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle } from "react-native"
import { Icon, Text, useTheme } from "react-native-paper"
import Animated, { AnimatedStyle, SharedTransition, SharedTransitionType, withSpring } from "react-native-reanimated"

export interface SearchbarLayoutProps {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface SearchbarProps {
    onPress?: (layout: SearchbarLayoutProps) => void;
    // sharedTransitionStyle?: SharedTransition;
    style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const transition = SharedTransition.custom((values) => {
    'worklet';
    return {
      height: withSpring(values.targetHeight, { duration: 1000 }),
      width: withSpring(values.targetWidth, { duration: 1000 }),
    };
  })
    .progressAnimation((values, progress) => {
      'worklet';
      const getValue = (
        progress: number,
        target: number,
        current: number
      ): number => {
        return progress * (target - current) + current;
      };
      return {
        width: getValue(progress, values.targetWidth, values.currentWidth),
        height: getValue(progress, values.targetHeight, values.currentHeight),
      };
    })
    .defaultTransitionType(SharedTransitionType.ANIMATION);

export const InactiveSearchbar = ({ onPress, style }: SearchbarProps) => {
    const { colors, roundness } = useTheme();
    const [layout, setLayout] = React.useState({ width: 0, height: 0, x: 0, y: 0 });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height, x, y } = event.nativeEvent.layout;
        setLayout({ width, height, x, y });
    }

    return (
        <Animated.View
            sharedTransitionTag="inactifSearchbar"
            sharedTransitionStyle={transition}
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: roundness
                },
                style
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress && onPress(layout)}
                onLayout={handleLayout}
                style={styles.innerContainer}
            >
                <Icon size={24} source="magnify" color={colors.onSurfaceVariant} />
                <Text style={{ color: colors.onSurfaceVariant }}>Search</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
})
