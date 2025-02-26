import React from "react";
import { Animated, ImageSourcePropType, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Extrapolation, SharedValue, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { scrollPosition } from "./utils";
import { AnimatedText } from "@/common";

export interface HeaderBarProps {
    headerHeight: number;
    scrollValue: SharedValue<number>;
    handleBarLayout: (event: LayoutChangeEvent) => void;

    image: React.ReactNode;
    title: string;
    rightTopIcon?: React.ReactNode;
    leftTopIcon?: React.ReactNode;
}

export const HeaderBar = ({
    headerHeight: height,
    scrollValue,
    handleBarLayout,
    image,
    title,
    rightTopIcon,
    leftTopIcon,
}: HeaderBarProps) => {

    const [beforeFadeImg, startFadeImg, finishFadeImg] = [
        scrollPosition(height, 30),
        scrollPosition(height, 40),
        scrollPosition(height, 70),
    ];
    const [beforeFadeName, startFadeName, finishFadeName] = [
        scrollPosition(height, 50),
        scrollPosition(height, 60),
        scrollPosition(height, 75),
    ];

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollValue.value,
                [0, beforeFadeImg, startFadeImg, finishFadeImg],
                [0, 0, 0.5, 1],
                Extrapolation.CLAMP
            ),
        };
    }, [scrollValue, beforeFadeImg, startFadeImg, finishFadeImg]);
    const nameAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollValue.value,
                [0, beforeFadeName, startFadeName, finishFadeName],
                [0, 0, 0.5, 1],
                Extrapolation.CLAMP
            ),
        };
    }, [scrollValue, beforeFadeName, startFadeName, finishFadeName]);

    return (
        <SafeAreaView edges={['left', 'right', 'top']} style={styles.container} onLayout={handleBarLayout}>
            <Animated.View style={styles.headerWrapper}>
                {leftTopIcon && (
                    <View style={styles.leftHeaderButton}>
                        {leftTopIcon}
                    </View>
                )}
                <View style={styles.headerTitleContainer}>
                    <Animated.View style={imageAnimatedStyle}>
                        {image}
                    </Animated.View>
                    <AnimatedText style={nameAnimatedStyle}>
                        {title}
                    </AnimatedText>
                </View>
                {rightTopIcon && (
                    <View style={styles.rightHeaderButton}>
                        {leftTopIcon}
                    </View>
                )}
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    headerWrapper: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    headerPic: {
        width: 32,
        height: 32,
        borderRadius: 8,
    },
    headerTitleContainer: {
        flex: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftHeaderButton: {
        alignItems: 'flex-start',
        flex: 1,
    },
    rightHeaderButton: {
        flex: 1,
        alignItems: 'flex-end',
    },
});
