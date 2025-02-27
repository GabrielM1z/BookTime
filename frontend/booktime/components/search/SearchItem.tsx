import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { withAnimated } from '@/common';
import { SearchCover } from '../Cover';
import { ManageLibrarySnackbar } from '@/components/snackbar';

const IconButtonAnimated = withAnimated(IconButton);

export interface SearchItemProps {
    idBook: string;
    title: string;
    authors?: string[];
    uri: string;
    onPress?: (idBook: string) => void;
    checked?: boolean;
    onCheck?: (idBook: string, checked: boolean) => void;
}

export const SearchItem = ({ idBook, title, authors, uri, checked = false, onPress, onCheck }: SearchItemProps) => {
    const { colors } = useTheme();
    const [toggled, setToggled] = useState(checked);
    const scale = useSharedValue(1);

    const handlePress = () => {
        setToggled(!toggled);
        onCheck?.(idBook, !toggled);

        scale.value = withSpring(1.2, { damping: 8, stiffness: 100 }, () => {
            scale.value = withSpring(1);
        });
    };

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }), [toggled]);

    const containerStyle = useMemo(() => [
        { borderBottomColor: colors.outline },
        styles.container
    ], [colors]);

    const iconStyle = useMemo(() => [
        styles.icon,
        iconAnimatedStyle,
    ], [iconAnimatedStyle]);

    return (
        <>
            <TouchableOpacity style={containerStyle} onPress={() => onPress?.(idBook)}>
                <SearchCover uri={uri} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    {authors && <Text style={styles.authors} numberOfLines={1}>{authors.join(', ')}</Text>}
                </View>
                <IconButtonAnimated
                    icon={toggled ? "check" : "plus"}
                    mode={"contained"}
                    style={iconStyle}
                    onPress={handlePress}
                    selected={toggled}
                />
            </TouchableOpacity >
            <Divider />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    image: {
        width: 80,
        height: 100,
        borderRadius: 4,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    authors: {
        fontSize: 14,
        color: '#666',
    },
    icon: {
        borderRadius: 30,
        alignSelf: "center",
    },
});
