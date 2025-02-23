import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { IconButton, Searchbar, useTheme } from 'react-native-paper';



const DiscoverTab = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const { roundness } = useTheme();
    const router = useRouter();

    const handleSearchFocus = () => {
        router.push('search' as Href);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <Pressable
                    onPress={handleSearchFocus}
                    style={{ flex: 1 }}
                >
                    <Searchbar
                        placeholder="Search"
                        value={searchQuery}
                        editable={false}
                    />
                </Pressable>
                <IconButton icon='qrcode-scan' />
            </View>
            <View style={{ flex: 1, padding: 10 }}>

            </View>
        </SafeAreaView>
    )
}

export default DiscoverTab;

const styles = StyleSheet.create({
    headerContainer: {
        // flex: 1,
        flexDirection: 'row',
        padding: 10,
    },

})