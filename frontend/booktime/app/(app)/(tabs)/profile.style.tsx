import { Dimensions, StyleSheet } from 'react-native';

export const { height: sHeight, width: sWidth } = Dimensions.get('screen');
const Colors = {
    darkGray: '#22313a',
    gray: '#3b6978',
    orange: '#f9a03f',
    black: '#000',
};

export const headerMaxHeight = 250;
export const headerMinHeight = 60;
export const profileImageMaxSize = 100;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    header: {
        position: 'absolute', // Need by banner image to be on top
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.darkGray,
        overflow: 'hidden',
        zIndex: 5,
    },
    innerHeader: {
        flex: 1,
        paddingHorizontal: 20,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    menuContainer: {
        position: 'absolute',
        right: 20,
        justifyContent: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray + '30',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerImage: {
        width: '100%',
        height: headerMaxHeight,
        position: 'absolute',
        top: 0,
    },
    profileImage: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
    },
    profileName: {
        position: 'relative',
        marginLeft: 10,
        color: Colors.orange,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingTop: headerMaxHeight,
    },
    innerContainer: {
        margin: 20,
    },
    description: {
        color: 'white',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'justify',
    },
});