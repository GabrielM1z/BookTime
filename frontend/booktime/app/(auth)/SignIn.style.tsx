import { StyleSheet, Dimensions } from "react-native";

const { width: ScreenWidth } = Dimensions.get("screen");

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
        padding: 16,
        justifyContent: 'space-between', // Ajoute de l'espace entre le contenu principal et le bas

    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
        zIndex: 10, // Assurez-vous que le spinner est au-dessus de tout
    },
    logoImageStyle: {
        width: 150,
        height: 150,
        alignSelf: "center",
        borderRadius: 100,
    },
    textInputContainer: {
        marginTop: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    usernameTextInputContainer: {
        flexDirection: "row",
        width: ScreenWidth * 0.9,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "white",
    },
    passwordTextInputContainer: {
        flexDirection: "row",
        width: ScreenWidth * 0.9,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "white",
    },
    textInput: {
        flex: 1,
    },
    eyeIconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        width: ScreenWidth * 0.9,
    },
    switchText: {
        marginLeft: 8,
    },
    disabledButtonStyle: {
        backgroundColor: "#b0c4de",
    },
    loginButtonStyle: {
        height: 50,
        width: ScreenWidth * 0.9,
        backgroundColor: "#25a9e2",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    loginTextStyle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signupButtonStyle: {
        marginVertical: 8,
        alignSelf: "center",
    },
    signupTextStyle: {
        color: "#25a9e2",
        fontWeight: "bold",
        fontSize: 14,
    },
    forgotPasswordStyle: {
        marginTop: 8,
        alignSelf: "center",
    },
    forgotPasswordTextStyle: {
        color: "#999",
        fontSize: 14,
    },
    socialLoginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    socialBubble: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#EA4335",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 8,
    },
    facebookBubble: {
        backgroundColor: "#4267B2",
    },
    twitterBubble: {
        backgroundColor: "#1DA1F2",
    },
});
