import { StyleSheet, Text, View } from 'react-native';

import TitreTab from '../../components/TitreTab';


export default function HomeScreen() {
    return (
        <View style={styles.container}>
			<TitreTab label={"Bibliothèque"}></TitreTab>
        </View>
	);
}


const styles = StyleSheet.create({
  	container: {
		flex: 1,
		backgroundColor: '#25292e',
	},
});