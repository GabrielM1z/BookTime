import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import SearchBar from '@/components/SearchBar';
import TitreTab from '@/components/TitreTab';
import LivreRecherche from '@/components/LivreRecherche'
import { ThemedView } from '@/components/ThemedView';

import { apiLink } from '@/constants/Api';
import { Book, BookResponse } from '../models/Book';

const cover1 = require('@/assets/images/logo_refait.png');

// function getListBookFromQuery(query: String) {
// 	try {
// 		fetch(apiLink + query)
// 		.then(response => response.json())
// 		.then(json => setBookList(json.items))
		
// 	} catch (error) {
// 		console.log("Erreur API")
// 	}
// }

// useEffect(()=> getListBookFromQuery(""))

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

// function test(book : Book, index : number) {
// 	try {
// 		return <LivreRecherche key={index} cover={book.volumeInfo.imageLinks.thumbnail} title={book.volumeInfo.title} writter={book.volumeInfo.authors}></LivreRecherche>
// 	} catch (error) {
// 		console.log(index, book.volumeInfo.title);
// 		return <LivreRecherche key={index} cover={book.volumeInfo.imageLinks.thumbnail} title={book.volumeInfo.title} writter={"toto"}></LivreRecherche>
// 	}
// }

export default function HomeScreen() {
	const [bookList, setBookList] = useState<Book[]>([]);
	
	let getListBookFromQuery = (query : string)=>{
		try {
			fetch(apiLink + query)
			.then(response => response.json())
			.then(json => setBookList(json.items))
			
		} catch (error) {
			console.log("Erreur API")
		}
	}

	return (

		<ThemedView style={styles.body}>
			<ScrollView style={styles.dataTableContainer} stickyHeaderIndices={[0]}>
				<SearchBar qrcode={true} onChangeEvent={getListBookFromQuery}></SearchBar>
				{bookList ? (bookList.map((book, index) => (
					<LivreRecherche key={index} cover={book.volumeInfo.imageLinks} title={book.volumeInfo.title} writter={book.volumeInfo.authors}></LivreRecherche>
					// test(book, index)
				))) : (<Text>Loading...</Text>
				)}
				{/* {books.map((book, index) => (
			  <LivreRecherche key={index} cover={book.volumeInfo.imageLink.thumbnail} title={book.volumeInfo.title} writter={book.volumeInfo.authors[0]}></LivreRecherche>
			))} */}
			</ScrollView>

		</ThemedView>

	);
}


const styles = StyleSheet.create({
	body: {
		height: "100%",
	},
	dataTableContainer: {
		marginHorizontal: "5%",
		marginTop: "5%",
		flexDirection: "column",
	},
});