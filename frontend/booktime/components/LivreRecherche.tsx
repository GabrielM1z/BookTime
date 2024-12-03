import { StyleSheet, View, Image, Pressable } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from './ThemedText';
import { Book } from '@/models/Book';
import { Book2 } from '@/models/Book2';
import React from 'react';

const defaultCover = require('@/assets/images/logo_refait.png');

export const LivreRecherche = ({ book }: { book: Book }) => {

  const handleAddBook = () => {
    console.log(`Book added: ${book}`);
  };

  return (
    <View style={styles.itemContainer}>

      <Image source={book.volumeInfo.imageLinks ? { uri: book.volumeInfo.imageLinks.thumbnail } : defaultCover} style={styles.itemImage} resizeMode={'cover'}></Image>
      <View style={styles.itemInfos}>
        <ThemedText type="titreLivreHorizontal" numberOfLines={1}>{book.volumeInfo.title}</ThemedText>
        <ThemedText type="auteurLivreHorizontal">{book.volumeInfo.authors ? book.volumeInfo.authors[0] : "Inconnue"}</ThemedText>
      </View>
      <View style={styles.addItemContainer}>
        <Pressable onPress={handleAddBook} style={styles.addItem}>
          <TabBarIcon size={20} color={"#1E9AA4"} name={'add'} />
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 10
  },
  itemImage: {
    backgroundColor: 'yellow',
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: "#1E9AA4",
    borderWidth: 1,
    flex:2,
  },
  itemInfos: {
    padding: 10,
    flex:6,
  },
  titreItem: {
    fontSize: 18,
    color: "white"
  },
  autheurItem: {
    fontSize: 17,
    color: "gray",
  },
  addItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex:1,
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