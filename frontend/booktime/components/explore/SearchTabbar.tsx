import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, SearchbarLayoutProps } from './Searchbar';

import { ButtonsTopTabbar } from '@/common';

export interface ButtonsTabbarProps extends MaterialTopTabBarProps {
    onSearchPress?: (layout: SearchbarLayoutProps) => void;
};

export const SearchTabbar: React.FC<ButtonsTabbarProps> = ({
    onSearchPress,
    ...props
}) => {
    return (
        <SafeAreaView edges={["top"]} style={[styles.container]}>
            <Searchbar onPress={onSearchPress} />
            <ButtonsTopTabbar {...props} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})