import { StyleSheet, View, Image, Pressable } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from './ThemedText';
import { BookAllInfos, BookInfos, BookInfosSearch } from '@/models/Book';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Buffer } from 'buffer';
import { Colors } from '@/constants/Colors';
import { createBook, getBookByIsbn13, insertBook } from '@/db/db-book';
import { Library } from '@/models/Library';
import { useRepository } from '@/hooks/useRepository';



const defaultCover = require('@/assets/images/logo_refait.png');

// async function getImageAsBase64(url: string): Promise<string | null> {
//   console.log("coucou")

//   try {
//     const response = await axios.get(url, { responseType: 'arraybuffer' }); // Utilisez 'arraybuffer' pour manipuler des données binaires
//     const base64 = Buffer.from(response.data, 'binary').toString('base64'); // Convertissez les données en Base64
//     console.log('Image fetched successfully as Base64.');
//     return `data:image/jpeg;base64,${base64}`; // Retournez une chaîne Base64 utilisable dans React Native
//   } catch (error) {
//     console.error('Error fetching the image as Base64:', error);
//     return null;
//   }
// }

export const LivreRecherche = ({ book }: { book: BookInfosSearch }) => {

  const { bookRepository, libraryRepository } = useRepository();
  
  const handleAddBook = async () => {

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
    console.log("listLibrary : " , listLibrary)

    for( let library of listLibrary){
      console.log("library_name = ", library.name ," / library_id = ", library.id);
    }
    

    bookRepository.addBookToLibrary("1", bookInfosDatasBase)

    console.log(`Book added: ${book.title}`);
  };

  const [imageSource, setImageSource] = useState<string | number>(defaultCover);

  useEffect(() => {
    const fetchAndConvertImage = async () => {
      try {
        // Téléchargez l'image et convertissez-la en Base64
        const response = await axios.get(book.thumbnail, { responseType: 'arraybuffer' });
        const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
        setImageSource(base64Image); // Mettez à jour l'état avec l'image en Base64
      } catch (error) {
        console.error('Error fetching and converting image:', error);
        // En cas d'échec, vous pouvez garder l'image temporaire ou définir une image d'erreur
      }
    };

    fetchAndConvertImage();
  }, [book.thumbnail]);

  return (
    <View style={styles.itemContainer}>

      <Image source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} style={styles.itemImage} resizeMode={'cover'}></Image>
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