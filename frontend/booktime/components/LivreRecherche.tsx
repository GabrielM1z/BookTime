import { StyleSheet, View, Text, Image } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from './ThemedText';


export default function LivreRecherche({ cover, title, writter }) {

    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemInfosContainer}>
                <Image source={cover} style={styles.itemImage}></Image>
                <View style={styles.itemInfos}>
                    <ThemedText style={styles.titreItem}>{title}</ThemedText>
                    <ThemedText style={styles.autheurItem}>{writter}</ThemedText>
                </View>
            </View>
            <View style={styles.addItemContainer}>
                <View style={styles.addItem}>
                    <TabBarIcon size={20} color={"#1E9AA4"} name={'add'} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 10
      // justifyContent:"space-between"
    },
    itemInfosContainer: {
      flexDirection: "row",
      width: "85%"
    },
    itemImage: {
      backgroundColor: 'yellow',
      width: 100,
      height: 100,
  
      borderRadius: 10,
      borderColor: "#1E9AA4",
      borderWidth:1,
    },
    itemInfos: {
      padding: 10,
    },
    titreItem: {
      fontSize: 18,
      color:"white"
    },
    autheurItem: {
      fontSize: 17,
      color: "gray",
    },
    addItemContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    addItem: {
      width: 40,
      height: 40,
  
      borderColor: "#1E9AA4",
      borderStyle: "solid",
      borderWidth: 3,
      borderRadius: 10,
      backgroundColor: "white",
  
  
      justifyContent: "center",
      alignItems: "center",
  
    },
  });