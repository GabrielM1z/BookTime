import { StyleSheet, Text, View, TextInput } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import SearchBar from '@/components/SearchBar';



export default function HomeScreen() {
  return (

    <View style={styles.body}>
      <SearchBar qrcode={true}></SearchBar>
        <Text>yo</Text>

      <View style={styles.dataTableContainer}>
        <Text>yo</Text>
      </View>
    </View>

  );
}


const styles = StyleSheet.create({
  body: {
    paddingTop: 50,
    backgroundColor: '#fff',
    height: "100%",
  },
  dataTableContainer: {
    width: 700,
    height: 700,
    backgroundColor: "black",
  }
});