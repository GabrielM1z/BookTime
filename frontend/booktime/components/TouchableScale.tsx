import React, { ReactNode } from 'react';
import { TouchableWithoutFeedback, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface TouchableScaleProps {
    children: ReactNode;
    style?: ViewStyle | ViewStyle[];
    scaleTo?: number; // La valeur de scale lors de l'appui
    duration?: number; // Durée de l'animation
    onPress?: () => void; // Fonction à appeler lors du press
}

const TouchableScale: React.FC<TouchableScaleProps> = ({
    children,
    style,
    scaleTo = 0.95,
    duration = 150,
    onPress,
}) => {
    // Valeur animée pour le scale
    const scale = useSharedValue(1);

    // Gérer les animations
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    // Actions lors du press
    const handlePressIn = () => {
        scale.value = withTiming(scaleTo, { duration });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration });
    };

    return (
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
        >
            <Animated.View style={[animatedStyle, style]}>
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default TouchableScale;
