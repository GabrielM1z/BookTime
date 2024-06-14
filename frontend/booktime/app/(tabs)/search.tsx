import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import SearchBar from '@/components/SearchBar';

const cover1 = require('@/assets/images/logo_refait.png');

const books = [
  { title: 'Titre du livre 1', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 2', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 3', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 4', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 5', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 6', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 1', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 2', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 3', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 4', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 5', autheur: "Martinez", url: cover1 },
  { title: 'Titre du livre 6', autheur: "Martinez", url: cover1 },
];

export default function HomeScreen() {
  return (

    <View style={styles.body}>
      <SearchBar qrcode={true}></SearchBar>

      <View style={styles.dataTableContainer}>
        <ScrollView>
          {books.map((book, index) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemInfosContainer}>
                <Image source={book.url} style={styles.itemImage}></Image>
                <View style={styles.itemInfos}>
                  <Text style={styles.titreItem}>{book.title}</Text>
                  <Text style={styles.autheurItem}>{book.autheur}</Text>
                </View>
              </View>
              <View style={styles.addItemContainer}>
                <View style={styles.addItem}>
                  <TabBarIcon size={15} color={"white"} name={'add'} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
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
    margin: "5%",
    // backgroundColor: "red",
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 10
    // justifyContent:"space-between"
  },
  itemInfosContainer:{
    flexDirection:"row",
    width:"85%"
  },
  itemImage: {
    backgroundColor: 'yellow',
    width: 100,
    height: 100,
    borderRadius: 10
  },
  itemInfos: {
    padding: 10,
  },
  titreItem: {
    fontSize: 18,
  },
  autheurItem: {
    fontSize: 17,
    color: "#505050",
  },
  addItemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  addItem: {
    width: 40,
    height: 40,

    borderRadius: 10,
    backgroundColor: "black",


    justifyContent: "center",
    alignItems: "center",

  },
});