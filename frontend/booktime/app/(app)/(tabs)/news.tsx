
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import TitreTab from '@/components/TitreTab';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';


export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    // console.log(insets)

    useEffect(() => {
        console.log(insets);
    }, [insets]);
    return (
        // <View>
        <SafeAreaView style={styles.container}>
            {/* <StatusBar hidden={true}></StatusBar> */}
            <TitreTab label={"News"}></TitreTab>
            <View style={styles.inner}></View>
        </SafeAreaView>
        // {/* </View> */}
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        backgroundColor: 'red',
    }
});