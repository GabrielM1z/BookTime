import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileItemTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        flex: 1,
        marginRight: 12,
    },
    profileImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileTextContainer: {
        flex: 1,
    },
    profileText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});
