import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { InactiveSearchbar, SearchbarLayoutProps } from './Searchbar';

export interface ButtonsTabbarProps extends MaterialTopTabBarProps {
    onSearchPress?: (layout: SearchbarLayoutProps) => void;
};

export const ButtonsTabbar: React.FC<ButtonsTabbarProps> = ({
    state,
    descriptors,
    navigation,
    onSearchPress,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container]}>
            <InactiveSearchbar onPress={onSearchPress} />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const focused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    return (
                        <Button
                            key={route.key}
                            mode="contained"
                            onPress={onPress}
                            buttonColor={focused ? colors.primary : colors.surfaceVariant}
                            textColor={focused ? colors.onPrimary : colors.onSurfaceVariant}
                            style={styles.button}
                        >
                            {label as string}
                        </Button>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
    },
    scrollContainer: {
        flexDirection: 'row',
        // paddingHorizontal: 10,
        alignItems: 'center',
    },
    button: {
        marginRight: 10,
    },
})