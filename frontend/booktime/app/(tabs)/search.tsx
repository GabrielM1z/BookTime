import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import SearchBar from '@/components/SearchBar';
import TitreTab from '@/components/TitreTab';
import LivreRecherche from '@/components/LivreRecherche'

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
      <ScrollView style={styles.dataTableContainer} stickyHeaderIndices={[0]}>
        <SearchBar qrcode={true}></SearchBar>
        {books.map((book, index) => (
          <LivreRecherche key={index} cover={book.url} title={book.title} writter={book.autheur}></LivreRecherche>
        ))}
      </ScrollView>

    </View>

  );
}


const styles = StyleSheet.create({
  body: {
    backgroundColor: '#0C3952',
    height: "100%",
  },
  dataTableContainer: {
    marginHorizontal: "5%",
    marginTop: "5%",
    flexDirection: "column",
  },
});