import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import SearchBar from '@/components/SearchBar';
import TitreTab from '@/components/TitreTab';
import LivreRecherche from '@/components/LivreRecherche';

const cover1 = require('@/assets/images/logo_refait.png');

export default function HomeScreen( {bookList} ) {
  return (
      <ScrollView style={styles.dataTableContainer}>
        {bookList.map((book, index) => (
          <LivreRecherche cover={book.url} title={book.title} writter={book.autheur}></LivreRecherche>
        ))}
      </ScrollView>

  );
}


const styles = StyleSheet.create({
  dataTableContainer: {
    marginHorizontal: "5%",
    marginTop : "5%",
    flexDirection: "column",
    
  },
});