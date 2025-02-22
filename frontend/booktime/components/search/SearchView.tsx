import React, { useEffect, useMemo, useRef, useState } from "react";
import { DimensionValue, Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Searchbar, useTheme, IconButton } from "react-native-paper";


const { width, height } = Dimensions.get("window");


export interface SearchViewProps {
    children?: React.ReactNode;
}

export const SearchView = () => {
    const theme = useTheme();

    const [expanded, setExpanded] = useState(false);

    const scale = useSharedValue(1);
    const borderRadius = useSharedValue(10);
    const buttonWidth = useSharedValue<DimensionValue>("auto");
    const buttonHeight = useSharedValue<DimensionValue>("auto");
    const shadowOpacity = useSharedValue(0.3);
    const shadowRadius = useSharedValue(5);

    const border = useSharedValue(0);

    useEffect(() => {
        if (!expanded) {
            borderRadius.value = withTiming(10, { duration: 300 });
            buttonWidth.value = withTiming("auto", { duration: 500 });
            buttonHeight.value = withTiming("auto", { duration: 500 });
            // shadowOpacity.value = withTiming(0.5, { duration: 500 });
            // shadowRadius.value = withTiming(15, { duration: 500 });

        } else {
            borderRadius.value = withTiming(0, { duration: 300 });
            buttonWidth.value = withTiming("100%", { duration: 300 });
            buttonHeight.value = withTiming("100%", { duration: 300 });
            // shadowOpacity.value = withTiming(0.3, { duration: 300 });
            // shadowRadius.value = withTiming(5, { duration: 300 });

        }
    }, [expanded]);

    const handleTextChanged = (text: string) => {
        console.log(text, text.length > 0);
        setExpanded(text.length > 0);
    }

    const animatedViewStyle = useAnimatedStyle(() => ({
        borderRadius: borderRadius.value,
        position: expanded ? "absolute" : "relative",
        height: withTiming(expanded ? height : 60, { duration: 300 }),
        width: withTiming(expanded ? width : "80%", { duration: 300 }),

        // shadowOpacity: shadowOpacity.value,
        // shadowRadius: shadowRadius.value,
        // elevation: expanded ? 10 : 5, // Pour Android
        zIndex: expanded ? 10 : 1,
    }), [expanded]);

    const viewStyle = useMemo(() =>
        [styles.ripple, {
            backgroundColor: theme.colors.elevation.level3,
            borderRadius: theme.roundness * 7,
        }, animatedViewStyle],
        [animatedViewStyle]
    );

    // const textColor = theme.colors.onSurfaceVariant
    // const rippleColor = color(textColor).alpha(0.32).rgb().string()

    return (
        <Animated.View style={viewStyle}>
            <View style={[styles.searchbarContainer, { flex: expanded ? 0 : 1 }]}>
                <IconButton
                    borderless
                    // rippleColor={rippleColor}
                    // iconColor={textColor}
                    icon="magnify"
                    theme={theme}
                />
                <TextInput
                    onChangeText={handleTextChanged}
                    placeholder="Search"
                    placeholderTextColor={theme.colors.onSurface}
                    selectionColor={theme.colors.primary}
                    underlineColorAndroid="transparent"
                    returnKeyType="search"
                    keyboardAppearance={theme.dark ? 'dark' : 'light'}
                    style={
                        [styles.input, {
                            color: theme.colors.onSurfaceVariant,
                            ...theme.fonts.bodyLarge,
                            // lineHeight: Platform.select({
                            //   ios: 0,
                            //   default: fonts.bodyLarge.lineHeight,
                            // }),
                        }]}
                // value={value}
                />
            </View>
            <View style={{ flex: 1, display: expanded ? "flex" : "none" }}>

            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    searchbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        // flex: 1,
        fontSize: 18,
        paddingLeft: 8,
        alignSelf: 'stretch',
        // textAlign: I18nManager.getConstants().isRTL ? 'right' : 'left',
        minWidth: 0,
    },
    ripple: {
        backgroundColor: "red",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
})