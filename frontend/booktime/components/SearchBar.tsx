import { StyleSheet, View, TextInput } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedView } from './ThemedView';
import { useEffect, useState } from 'react';


export default function searchBar({ qrcode, onChangeEvent }) {

    let searchBarQR = <View></View>;
    if (qrcode) {
        searchBarQR =
            <View style={styles.qrSearchContainer}>
                <View style={styles.qrSearch}><TabBarIcon size={30} color={"white"} name={'qr-code'} /></View>
            </View>;
    }

    // const [searchTerm, setSearchTerm] = useState("");

    let delayedDebounceFn : NodeJS.Timeout;

    const setSearchTerm = (searchTerm: string) => {

        clearTimeout(delayedDebounceFn)

        delayedDebounceFn = setTimeout(() => {
            onChangeEvent(searchTerm);
        }, 3000)

    };



    let searchWaiting: NodeJS.Timeout;
    return (

        <ThemedView style={styles.searchBarComponent}>
            <View style={styles.searchContainer}>
                <TabBarIcon size={40} name={'search'} />
                <TextInput style={styles.searchBar} onChangeText={setSearchTerm} />
            </View>
            {searchBarQR}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    searchBarComponent: {
        flexDirection: "row",
        width: "100%",
        borderBottomColor: "#191A32",
        borderStyle: "solid",
        borderBottomWidth: 1,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "70%",
        marginRight: 10,
        marginVertical: 10,
        backgroundColor: "white",
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
    },
    searchBar: {
        width: "100%",
        height: 40,
        padding: 10
    },
    qrSearchContainer: {
        width: "20%",
        marginVertical: 10,
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
