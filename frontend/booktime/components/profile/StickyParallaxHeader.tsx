import { HeaderBar } from "./HeaderBar"
import { View, StyleSheet, TouchableOpacity, LayoutChangeEvent, Text, ImageSourcePropType } from "react-native"
import React, { useCallback, useMemo, useRef, useState } from "react"
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated"
import { useUser } from "@/hooks/useUser";
import styles, { headerMinHeight, headerMaxHeight, profileImageMaxSize } from "@/styles/profile";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Avatar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsiveSize } from "./utils";
import { withAnimated } from "@/common";
import { Foreground } from "./Foreground";

export const headerPageText = "Embark on a journey of transformation with our innovative app designed to enhance every aspect of your life. Whether you're seeking to boost productivity, ignite creativity, or simply streamline daily tasks, our platform empowers you to reach new heights.";

export interface StickyParallaxHeaderProps {
    image: React.ReactNode;
    title: string;
}

export const StickyParallaxHeader = ({
    image,
    title,
}: StickyParallaxHeaderProps) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollValue = useScrollViewOffset(scrollRef);

    const { responsiveHeight } = useResponsiveSize();
    const headerHeight = responsiveHeight(40);

    const [headerBarHeight, setHeaderBarHeight] = useState(0);

    const handleBarLayout = (event: LayoutChangeEvent) => {
        setHeaderBarHeight(event.nativeEvent.layout.height);
    }

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollValue.value,
                        [0, headerHeight],
                        [0, -headerHeight],
                        Extrapolation.EXTEND
                    ),
                },
            ],
        };
    }, [scrollValue, headerHeight]);

    return (
        <View>
            <HeaderBar
                headerHeight={headerHeight}
                scrollValue={scrollValue}
                handleBarLayout={handleBarLayout}

                image={image}
                title={title}
            />
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <Foreground
                    headerHeight={headerHeight}
                    scrollValue={scrollValue}

                    image={image}
                    title={title}
                />

                <Animated.ScrollView
                    ref={scrollRef}
                    // contentContainerStyle={styles.scrollContent}
                    // snapToOffsets={[headerHeight - headerBarHeight]}
                    // snapToEnd={false}
                    // overScrollMode={"always"}
                >
                    <View style={styles.innerContainer}>
                        <Text style={styles.description}>
                            {headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}{headerPageText}
                        </Text>
                    </View>
                </Animated.ScrollView>
            </Animated.View>
        </View>
    );
}
