import { StyleSheet, Text, View, Image, Button } from 'react-native';
import React from "react";

import TitreTab from '@/components/TitreTab';
import { ThemedView } from '@/components/ThemedView';
import { useRoute } from '@react-navigation/native';


export default function LivreDetail() {

    return (
        <ThemedView style={styles.container}>
			<TitreTab label="titre"></TitreTab>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
    coverLivre: {
        backgroundColor: 'yellow',
        width: 100,
        height: 100,
        borderRadius:20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
    },
});