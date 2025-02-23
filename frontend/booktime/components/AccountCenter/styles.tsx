import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    profileContainer: {
        gap: 4,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileItemTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        flex: 1,
        paddingHorizontal: 4,
    },
    profileImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        flex: 1,
    },
    footerContainer: {
        marginTop: 8,
    }
});
