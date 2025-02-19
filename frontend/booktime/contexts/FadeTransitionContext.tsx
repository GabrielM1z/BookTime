import React, { createContext, useContext } from "react";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from "react-native-reanimated";

// TODO: change this with navigation transition

interface FadeTransitionContextType {
    withFadeTransition: (callback: () => void, duration?: number) => void;
}

const FadeTransitionContext = createContext<FadeTransitionContextType | undefined>(undefined);


export const FadeTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const opacity = useSharedValue(1);

    const fadeStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const withFadeTransition = (callback: () => void, duration: number = 200) => {
        opacity.value = withTiming(0, { duration }, () => {
            runOnJS(callback)();
            opacity.value = withTiming(1, { duration });
        });
    };

    return (
        <FadeTransitionContext.Provider value={{ withFadeTransition }}>
            <Animated.View style={[{ flex: 1 }, fadeStyle]}>
                {children}
            </Animated.View>
        </FadeTransitionContext.Provider>
    );
};


export const useFadeTransition = (): FadeTransitionContextType => {
    const context = useContext(FadeTransitionContext);
    if (!context) {
        throw new Error("useFadeTransition must be used within a FadeTransitionProvider");
    }
    return context;
};
