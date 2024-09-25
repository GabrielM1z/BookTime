import { StyleSheet, View, TextInput } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedView } from './ThemedView';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';


interface SearchBarProps {
    qrcode: boolean;  // Type de la prop qrcode
    onSearch: (value: string) => void;  // Type de la prop onSearch
  }


export const SearchBar: React.FC<SearchBarProps> = ({ qrcode, onSearch }) => {

    let searchBarQR = <View></View>;
    if (qrcode) {
        searchBarQR =
            <View style={styles.qrSearchContainer}>
                <View style={styles.qrSearch}><TabBarIcon size={30} color={"white"} name={'qr-code'} /></View>
            </View>;
    }

    const [searchTerm, setSearchTerm] = useState('');

    // Update the search term and call the parent's onSearch function
    const debouncedChangeHandler = debounce((value: string) => {
        onSearch(value);  // Call the parent's function with the current value
    }, 500); // 500ms delay

    useEffect(() => {
        debouncedChangeHandler(searchTerm);

        // Cleanup function to cancel debounce on unmount
        return () => {
        debouncedChangeHandler.cancel();
        };
    }, [searchTerm]);

    return (

        <ThemedView style={styles.searchBarComponent}>
            <View style={styles.searchContainer}>
                <TabBarIcon size={40} name={'search'} />
                <TextInput 
                    style={styles.searchBar} 
                    value={searchTerm}
                    onChangeText={(text) => {
                        setSearchTerm(text);
                        debouncedChangeHandler(text); // Update debounced value
                    }} />
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
