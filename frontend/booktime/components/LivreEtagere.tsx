import { StyleSheet, View, Text, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import CoverPressable from './CoverPressable';
import React, { useEffect, useState } from 'react';
import { BookMinInfos } from '@/models/Book';
import { linkToBase64 } from '@/helpers/image';
import { Pressable } from 'react-native-gesture-handler';
import { PressableCover } from './Cover';
import { useRouter } from 'expo-router';

// component représentant le LIVRE de l'ETAGERE
interface LivreEtagereProps {
    livre: BookMinInfos;
}

export const LivreEtagere = ({ livre }: LivreEtagereProps) => {

    const router = useRouter()    

    const handleBookPress = (idBook: string) => {
        router.push({
            pathname: "/book/[idBook]",
            params: { idBook, mode: 'library' },
        });
    }

    return (
        <View style={styles.livreContainer}>
            <PressableCover idBook={livre.id_book} uri={livre.cover_image_url} onPress={ handleBookPress }></PressableCover>
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