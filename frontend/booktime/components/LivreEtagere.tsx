import { StyleSheet, View, Text, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import CoverPressable from './CoverPressable';
import React, { useEffect, useState } from 'react';
import { BookMinInfos } from '@/models/Book';
import { linkToBase64 } from '@/helpers/image';

// component représentant le LIVRE de l'ETAGERE
interface LivreEtagereProps {
    livre: BookMinInfos;
}

export default function LivreEtagere({ livre }: LivreEtagereProps) {

    return (
        <View style={styles.livreContainer}>
            <CoverPressable id_book={livre.id_book} cover={livre.cover_image_url} mode='library' ></CoverPressable>
            {/* <ThemedText type="titreLivreVertical">{livre.title}</ThemedText> */}
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