import { NavigationHeaderProps } from "@react-navigation/stack";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { StyleProp, StyleSheet, TextInput, ViewStyle } from "react-native";
import { IconButton, Text, useTheme, Appbar } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { modeAppbarHeight } from "react-native-paper/src/components/Appbar/utils";
import Animated, { AnimatedRef, useAnimatedStyle, useDerivedValue, useScrollViewOffset, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { withAnimated } from "./withAnimation";
import { getHeaderTitle } from '@react-navigation/elements';

const SafeAreaViewAnimated = withAnimated(SafeAreaView);

export interface AppBarProps extends NavigationHeaderProps {
    addTopEdge?: boolean;
    children?: React.ReactNode;
    leftIcon?: IconSource;
    onLeftIconPress?: () => void;
    rightIcon?: IconSource;
    onRightIconPress?: () => void;
    style?: StyleProp<ViewStyle>;
    scrollViewRef?: AnimatedRef<Animated.ScrollView | Animated.FlatList<any>>;
    scrollUnderUpdater?: (isUnder: boolean) => ViewStyle;
    backgroundColor?: string;
    backgroundColorScrollUnder?: string;
}

export interface SearchAppBarProps extends Omit<AppBarProps, 'children' | 'leftIcon' | 'onLeftIconPress' | 'rightIcon' | 'onRightIconPress'> {
    value?: string;
    onSearchChange?: (text: string) => void;
    onBack?: () => void;
    debounce?: number;
}

export const AppBar = ({
    addTopEdge = true,
    children,
    leftIcon = "arrow-left",
    onLeftIconPress,
    rightIcon,
    onRightIconPress,
    style,
    scrollViewRef,
    scrollUnderUpdater,
    backgroundColor: customBackgroundColor,
    backgroundColorScrollUnder: customBackgroundColorScrollUnder,
    ...appBarProps
}: AppBarProps) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const scrollY = useScrollViewOffset(scrollViewRef as AnimatedRef<Animated.ScrollView> | null);
    const title = getHeaderTitle(appBarProps.options, appBarProps.route.name);

    const backgroundColor = useMemo(() => customBackgroundColor ?? colors.surface, [customBackgroundColor, colors]);
    const backgroundColorScrollUnder = useMemo(() => customBackgroundColorScrollUnder ?? colors.elevation.level2, [customBackgroundColorScrollUnder, colors]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const isUnder = useDerivedValue(() => scrollY.value > 0, [scrollY]);

    const appBarAnimatedStyle = useAnimatedStyle(() => scrollUnderUpdater?.(isUnder.value) ?? {
        backgroundColor: withTiming(isUnder.value ? backgroundColorScrollUnder : backgroundColor, { duration: 100 }),
        shadowColor: withTiming(isUnder.value ? colors.shadow : 'transparent', { duration: 100 }),
        elevation: withTiming(isUnder.value ? 5 : 0, { duration: 100 }),
    }, [isUnder, backgroundColor, backgroundColorScrollUnder, colors, scrollUnderUpdater]);

    const appBarStyle = useMemo(() => {
        const stylesArray = [
            style,
            styles.appBar,
            {
                backgroundColor: backgroundColorScrollUnder,
                height: modeAppbarHeight["small"] + insets.top,
            },
        ];

        if (scrollViewRef) {
            stylesArray.push(appBarAnimatedStyle);
        }

        return stylesArray;
    }, [style, appBarAnimatedStyle, colors, scrollViewRef]);

    return (
        <SafeAreaViewAnimated style={appBarStyle}>
            {leftIcon && (
                <IconButton
                    icon={leftIcon}
                    onPress={onLeftIconPress ?? handleBack}
                />
            )}
            {children ?? <Text variant="titleLarge">{title}</Text>}
            {rightIcon && (
                <IconButton
                    icon={rightIcon}
                    onPress={onRightIconPress}
                />
            )}
        </SafeAreaViewAnimated>
    );
}

export const SearchAppBar = ({
    value,
    onSearchChange,
    onBack,
    debounce: wait = 500,
    ...appBarProps
}: SearchAppBarProps) => {
    const { fonts, colors } = useTheme();
    const [query, setQuery] = useState<string>(value ?? "");

    const debounceSearch = useMemo(() => debounce(onSearchChange ?? (() => { }), wait), [wait, onSearchChange]);

    const handleSearchChange = useCallback((text: string) => {
        setQuery(text);
        debounceSearch(text);
    }, [debounceSearch]);

    const textInputStyle = useMemo(() => [
        styles.textInput,
        { ...fonts.bodyLarge, color: colors.onSurface },
    ], [fonts, colors]);

    return (
        <AppBar
            onLeftIconPress={onBack}
            rightIcon={query ? "close" : undefined}
            onRightIconPress={() => handleSearchChange("")}
            // scrollUnderUpdater={(isUnder) => ({
            //     shadowColor: withTiming(isUnder ? colors.shadow : 'transparent', { duration: 100 }),
            //     elevation: withTiming(isUnder ? 5 : 0, { duration: 100 }),
            // })}
            {...appBarProps}
        >
            <TextInput
                value={query}
                onChangeText={handleSearchChange}
                placeholder="Search"
                style={textInputStyle}
                placeholderTextColor={colors.onSurfaceVariant}
                autoFocus
            />
        </AppBar>
    );
}

const styles = StyleSheet.create({
    appBar: {
        height: modeAppbarHeight["small"],
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 8,
        shadowOpacity: 0.2,
        // paddingVertical: 8,
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
    },
})