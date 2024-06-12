import { StyleSheet, View, TextInput } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';


export default function searchBar({ qrcode }) {

    let searchBarQR = <View></View>;
    if (qrcode) {
        searchBarQR =
            <View style={styles.qrSearchContainer}>
                <View style={styles.qrSearch}><TabBarIcon size={30} color={"white"} name={'qr-code'} /></View>
            </View>;
    }
    return (
        <View style={styles.body}>
            <View style={styles.searchBarComponent}>
                <View style={styles.searchContainer}>
                    <TabBarIcon size={40} name={'search'} />
                    <TextInput style={styles.searchBar} />
                </View>
                {searchBarQR}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        paddingTop: 50,
        backgroundColor: '#fff',
        height: "100%",
    },
    searchBarComponent: {
        flexDirection: "row",
        width: "100%"
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "70%"
    },
    searchBar: {
        width: "100%",
        height: 40,

        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,

        backgroundColor: "white",

        padding: 10
    },
    qrSearchContainer: {
        width: "20%"
    },
    qrSearch: {
        width: 40,
        height: 40,

        borderRadius: 10,
        backgroundColor: "black",


        justifyContent: "center",
        alignItems: "center",

    },
});
