import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    innerContainer: {
        gap: 46,
    },
    headerContainer: {
        alignItems: 'center',
    },
    bodyContainer: {
        justifyContent: "center",
        gap: 16,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});
