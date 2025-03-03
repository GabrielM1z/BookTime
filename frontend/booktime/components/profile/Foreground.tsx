import * as React from "react";
import type { ImageSourcePropType, StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import Animated, { Extrapolation, SharedValue, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { AnimatedText } from "@/common";


import { scrollPosition, useResponsiveSize } from "./utils";

interface ForegroundProps {
    headerHeight: number;
    scrollValue: SharedValue<number>;
    
    image: React.ReactNode;
    title?: string;
}

const finishImgPosition = 31;
const startImgPosition = 27;

export const Foreground = ({
    headerHeight,
    image,
    scrollValue,
    title,
}: ForegroundProps) => {
    const { responsiveWidth } = useResponsiveSize();

    const profilePicBorderRadius = responsiveWidth(4.5);

    const startSize = responsiveWidth(18);
    const endSize = responsiveWidth(12);
    const [startImgAnimation, finishImgAnimation] = [
        scrollPosition(headerHeight, startImgPosition),
        scrollPosition(headerHeight, finishImgPosition),
    ];
    const [startAuthorFade, finishAuthorFade] = [
        scrollPosition(headerHeight, 40),
        scrollPosition(headerHeight, 50),
    ];

    const imageOpacityAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollValue.value,
                [0, startImgAnimation, finishImgAnimation],
                [1, 0.8, 0],
                Extrapolation.CLAMP
            ),
        };
    }, [scrollValue, startImgAnimation, finishImgAnimation]);
    const imageAnimatedStyle = useAnimatedStyle(() => {
        const imageSize = interpolate(
            scrollValue.value,
            [0, startImgAnimation, finishImgAnimation],
            [startSize, startSize, endSize],
            Extrapolation.CLAMP
        );

        return {
            borderRadius: profilePicBorderRadius,
            height: imageSize,
            width: imageSize,
        };
    }, [
        scrollValue,
        startImgAnimation,
        finishImgAnimation,
        startSize,
        endSize,
        profilePicBorderRadius,
    ]);
    const authorAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollValue.value,
                [0, startAuthorFade, finishAuthorFade],
                [1, 1, 0],
                Extrapolation.CLAMP
            ),
        };
    }, [scrollValue, startAuthorFade, finishAuthorFade]);

    return (
        <View
            pointerEvents="none"
            style={[styles.foreground, styles.column]}
        >
            <Animated.View style={[imageOpacityAnimatedStyle, imageAnimatedStyle]}>
                {image}
            </Animated.View>
            <View>
                <AnimatedText style={[styles.userModalMessageContainer, authorAnimatedStyle]} variant={"titleMedium"}>
                    {title}
                </AnimatedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    foreground: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'flex-end',
    },
    column: {
        flexDirection: 'column',
    },
    message: {
        color: "white",
        fontSize: 48,
        lineHeight: 55,
        letterSpacing: -1,
        textAlign: 'left',
    },


    foregroundTitle: {
        flexGrow: 1,
        textAlign: 'left',
    },
    foregroundTitlePaddingEnd: {
        paddingEnd: 12,
    },
    foregroundTitlePaddingLeft: {
        paddingLeft: 12,
    },
    foregroundTitlePaddingRight: {
        paddingRight: 12,
    },
    infoContainer: {
        marginBottom: 16,
    },
    infoText: {
        flexGrow: 1,
        color: "white",
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
    },
    userModalMessageContainer: {
        alignItems: 'flex-start',
        marginTop: 12,
        paddingTop: 24,
        paddingBottom: 8,
    },
});
