import { TouchableOpacity, Text, StyleSheet, type TextProps, type TouchableOpacityProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Feather, FontAwesome } from '@expo/vector-icons'; // Assure-toi que ce package est installé avec `expo install @expo/vector-icons`

export type ThemedButtonProps = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'like' | 'toRead';
    textType?: TextProps['style']; // Permet de modifier le style du texte
    title?: string; // Titre optionnel (sera masqué pour les types spécifiques)
};

export function ThemedButton({
    style,
    lightColor,
    darkColor,
    type = 'default',
    textType,
    title,
    ...rest
}: ThemedButtonProps) {
    // Définition des couleurs
    const backgroundColor =
        type === 'like' ? '#ff4d4d' :
        type === 'toRead' ? '#007bff' :
        useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    
    const textColor = type === 'default' ? useThemeColor({ light: lightColor, dark: darkColor }, 'text') : '#fff';

    // Déterminer si c'est un bouton spécial (icône seule)
    const isIconOnly = type === 'like' || type === 'toRead';

    // Définition des icônes
    const getIcon = () => {
        if (type === 'like') return <FontAwesome name="heart" size={20} color="white" />;
        if (type === 'toRead') return <FontAwesome name="book" size={20} color="white" />;
        return null;
    };

    return (
        <TouchableOpacity
            style={[
                styles.buttonBase,
                isIconOnly ? styles.roundButton : undefined, // Applique le style rond si nécessaire
                { backgroundColor },
                style,
            ]}
            {...rest}
        >
            {getIcon()}
            {!isIconOnly && title && <Text style={[styles.text, { color: textColor }, textType]}>{title}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonBase: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    roundButton: {
        alignSelf: 'flex-start',
        borderRadius: 100, // Rend le bouton parfaitement rond
        alignItems: 'center',
        padding: 0, // Supprime les marges intérieures inutiles
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
