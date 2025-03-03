import { debounce } from "lodash";
import React, { useState } from "react"
import { TouchableOpacity, View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle, TextInput } from "react-native"
import { Icon, Text, useTheme } from "react-native-paper"

// TODO: add animation like https://www.reddit.com/r/reactnative/comments/14uazr6/custom_screen_transition/

export interface SearchbarLayoutProps {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface SearchbarProps {
    onPress?: (layout: SearchbarLayoutProps) => void;
    style?: StyleProp<ViewStyle>;
    active?: boolean;
    value?: string;
    onDebouncedSearch?: (value: string) => void;
}

export const Searchbar = ({
    onPress,
    style,
    active = false,
    value = "",
    onDebouncedSearch = () => { },
}: SearchbarProps) => {
    const { colors, fonts, roundness } = useTheme();
    const [layout, setLayout] = useState({ width: 0, height: 0, x: 0, y: 0 });
    const [searchTerm, setSearchTerm] = useState(value);

    const debounceSearch = debounce(onDebouncedSearch, 500);

    const handleTextChange = (value: string) => {
        setSearchTerm(value);
        debounceSearch(value);
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height, x, y } = event.nativeEvent.layout;
        setLayout({ width, height, x, y });
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: roundness,
                    padding: 10,
                },
                style
            ]}
        >
            {active ? (
                <TextInput
                    autoFocus
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={handleTextChange}
                    style={[
                        styles.textInput,
                        {
                            color: colors.onSurfaceVariant,
                            ...fonts.bodyLarge
                        }
                    ]}
                />
            ) : (
                <TouchableOpacity
                    onPress={() => onPress && onPress(layout)}
                    onLayout={handleLayout}
                    style={styles.innerContainer}
                >
                    <Icon size={24} source="magnify" color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurfaceVariant }}>Search</Text>
                </TouchableOpacity>

            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        padding: 0, 
        margin: 0, 
        flex: 1,
    }
})
