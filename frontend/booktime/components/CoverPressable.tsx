import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useNavigation } from 'expo-router';

// component représentant le LIVRE de l'ETAGERE
export default function CoverPressable({ cover }) {
	
    const navigation = useNavigation();

    const handleImagePress = () => {
        navigation.navigate('LivreDetail');
    };

	return (
        <TouchableOpacity onPress={handleImagePress}>
            <Image source={cover} style={styles.coverLivre} />
        </TouchableOpacity>     
	);
}


const styles = StyleSheet.create({
    coverLivre: {
        backgroundColor: 'yellow',
        width: 100,
        height: 100,
        borderRadius:20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
    },
});