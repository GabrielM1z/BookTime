import { StyleSheet, View, Pressable } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from './ThemedText';
import { BookAllInfos, BookInfos, BookInfosSearch } from '@/models/Book';
import React, { useEffect, useState } from 'react';

import { Colors } from '@/constants/Colors';
import { useRepository } from '@/hooks/useRepository';
import CoverPressable from './CoverPressable';

const defaultCover = require('@/assets/images/logo_refait.png');

export const LivreRecherche = ({ book }: { book: BookInfosSearch }) => {

  const { bookRepository, libraryRepository } = useRepository();
  
  const handleAddBook = async () => {

    //Données a récupérer depuis le back !

    const bookInfosDatasBase: BookAllInfos = {
      id_book: book.isbn13,
      title: book.title,
      description: "test",
      publisher: "test",
      publication_date : "test",
      page_number: 0,
      language: "test",
      cover_image_url: book.thumbnail,
    }

    const listLibrary = await libraryRepository.getAll()
    bookRepository.addBookToLibrary(listLibrary[0].id_library, bookInfosDatasBase)
  };

  return (
    <View style={styles.itemContainer}>

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