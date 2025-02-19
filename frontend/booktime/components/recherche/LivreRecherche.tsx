import { StyleSheet, View, Pressable, Text } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from '../ThemedText';
import { BookInfosSearch, BookInfosServeur } from '@/models/Book';
import React, { useState } from 'react';

import { Colors } from '@/constants/Colors';
import { useRepositoryContext } from '@/hooks/useRepository';
import CoverPressable from '../CoverPressable';
import api from '@/services/axios';
import { Snackbar, PaperProvider, Portal } from "react-native-paper";

interface LivreRechercheProps {
  book: BookInfosSearch;
}


export const LivreRecherche = ({ book }: LivreRechercheProps) => {

  const { bookRepository, libraryRepository } = useRepositoryContext();
    const [visible, setVisible] = useState(false);

  const showSnackbar = () => setVisible(true);
  const hideSnackbar = () => setVisible(false);


  const handleAddBook = async () => {

    try {
      //Données a récupérer depuis le back !
      let url: string = "/api/books/books/" + book.isbn13;
      let data: BookInfosServeur = await api.get(url);
      const listLibrary = await libraryRepository.getAll()
      await bookRepository.addBookToLibrary(listLibrary[0].id_library, data)


    } catch (error) {
      console.log("error handleAddBook :", error);
      showSnackbar();
    }
  };

  return (
    <View style={styles.itemContainer}>
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={3000} // Snackbar disappears after 3 seconds
          action={{
            label: "Change",
            onPress: () => hideSnackbar(),

          }}
        >
          Custom styled Snackbar!
        </Snackbar>
      </Portal>
      <CoverPressable id_book={book.isbn13} cover={book.thumbnail} mode='search'></CoverPressable>
      {/* <Image source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} style={styles.itemImage} resizeMode={'cover'}></Image> */}
      {/* <Image source={{uri:"data:image/png;base64,"+getImageAsBase64(book.thumbnail)}} defaultSource={defaultCover}  style={styles.itemImage} resizeMode={'cover'} ></Image> */}

      <View style={styles.itemInfos}>
        <ThemedText type="titreLivreHorizontal" numberOfLines={1}>{book.title}</ThemedText>
        <ThemedText type="auteurLivreHorizontal">{book.authors ? book.authors[0] : "Inconnue"}</ThemedText>
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
    backgroundColor: Colors.dark.primary,
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: "#1E9AA4",
    borderWidth: 1,
    flex: 2,
  },
  itemInfos: {
    padding: 10,
    flex: 6,
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
    flex: 1,
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