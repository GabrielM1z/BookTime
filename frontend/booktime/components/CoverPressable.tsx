import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useNavigation } from 'expo-router';

// component représentant la COUVERTURE du livre qui est CLIQUABLE
export default function CoverPressable({ cover }) {
	
    const navigation = useNavigation();
    const txt = "oui";

    const handleImagePress = () => {
        const label = "oui"
        navigation.navigate('livreDetails');
    };

	return (
        <TouchableOpacity onPress={handleImagePress}>
            <Image source={cover} style={styles.coverLivre} />
        </TouchableOpacity>     
	);
}


const styles = StyleSheet.create({
    coverLivre: {
        width: 100,
        height: 100,
        borderRadius:20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
    },
});