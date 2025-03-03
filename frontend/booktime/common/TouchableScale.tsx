import React, { ReactNode, useMemo } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { withAnimated } from './withAnimation';

const TouchableAnimated = withAnimated(TouchableWithoutFeedback);

export interface TouchableScaleProps {
    children: ReactNode;
    style?: ViewStyle | ViewStyle[];
    scaleTo?: number;
    duration?: number;
    onPress?: () => void;
}

export const TouchableScale = ({
    children,
    style,
    scaleTo = 0.95,
    duration = 150,
    onPress,
}: TouchableScaleProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const containerStyle = useMemo(() => [animatedStyle], []);

    const handlePressIn = () => {
        scale.value = withTiming(scaleTo, { duration });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration });
    };

    return (
        <TouchableAnimated
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={containerStyle}
        >
            <View style={style}>

                {children}
            </View>
        </TouchableAnimated>
    );
};
