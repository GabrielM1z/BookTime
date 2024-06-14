import { StyleSheet, Text, View } from 'react-native';

import TitreTab from '@/components/TitreTab';
import { ThemedView } from '@/components/ThemedView';


export default function LivreDetailScreen() {


    return (
        <ThemedView style={styles.container}>
			<TitreTab label={"Livre"}></TitreTab>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});