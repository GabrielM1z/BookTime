import { StyleSheet, View, Image, Pressable } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from './ThemedText';
import { Book, BookInfos } from '@/models/Book';
import { Book2 } from '@/models/Book2';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const defaultCover = require('@/assets/images/logo_refait.png');

// async function getImageAPI(book: BookInfos): Promise<string | number> {
//   if (book.thumbnail) {
//     try {
//       console.log(book.thumbnail)
//       const response = await axios.get(book.thumbnail, {
//         responseType: 'blob',
//       });
//       if (response.status === 200) {
//         return response.data; // Assurez-vous que response.data correspond à un type Image
//       } else {
//         return defaultCover; // Par défaut si le statut n'est pas 200
//       }
//     } catch (e) {
//       console.log(e);
//       return defaultCover; // En cas d'erreur dans la requête
//     }
//   } else {
//     return defaultCover; // Si aucun thumbnail n'est fourni
//   }
// }

export const LivreRecherche = ({ book }: { book: BookInfos }) => {

  // const [imageSource, setImageSource] = useState<string | number>(defaultCover);
  // console.log(("coucou"))
  // useEffect(() => {
  //   const fetchImage = async () => {
  //     const image = await getImageAPI(book);
  //     setImageSource(image);
  //   };

  //   fetchImage().catch((error) => {
  //     console.error('Error loading image:', error);
  //   });
  // }, [book]);

  console.log(book.thumbnail)

  const handleAddBook = () => {
    console.log(`Book added: ${book}`);
  };

  return (
    <View style={styles.itemContainer}>

      {/* <Image source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} style={styles.itemImage} resizeMode={'cover'}></Image> */}
      <Image source={book.thumbnail ? { uri: 'data:image/png;base64,'+book.thumbnail, cache: "reload" } : defaultCover} style={styles.itemImage} resizeMode={'cover'} ></Image>

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
    backgroundColor: 'yellow',
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