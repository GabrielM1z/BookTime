import { StyleSheet, View, Text, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import CoverPressable from './CoverPressable';
import React from 'react';

// component représentant le LIVRE de l'ETAGERE
interface LivreEtagereProps {
    id_book: string;
    label: string;
    cover: string;
}

export default function LivreEtagere({ id_book, label, cover }: LivreEtagereProps) {
	
	return (
		<View style={styles.livreContainer}>
            <CoverPressable id_book={id_book} cover={cover} ></CoverPressable>
            <ThemedText type="titreLivreVertical">{label}</ThemedText>            
		</View>
	);
}


const styles = StyleSheet.create({
    livreContainer: {
        alignSelf: 'center',
        padding: 3,
        margin: 3,
    },
});