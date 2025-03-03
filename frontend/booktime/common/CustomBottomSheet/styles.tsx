import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
export const MAX_HEIGHT = 150;

export const styles = StyleSheet.create({
    bottomSheet: {
        marginHorizontal: 4,
        borderRadius: 12,
        padding: 8,
    },
    containerSheet: {
        gap: 8,
    },
    backdropSheet: {
        backgroundColor: 'black',
    },
});
