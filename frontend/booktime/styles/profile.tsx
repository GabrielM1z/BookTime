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
        right: 0,
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    bannerImage: {
        width: '100%',
        height: headerMaxHeight,
        position: 'absolute',
        top: 0,
    },
    profileImageContainer: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
    },
    profileImage: {
        height: "100%",
        width: "100%",
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
