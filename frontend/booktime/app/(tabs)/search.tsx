import { StyleSheet, Text, View, Image, ScrollView, FlatList, ActivityIndicator, VirtualizedList } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import SearchBar from '@/components/SearchBar';
import TitreTab from '@/components/TitreTab';
import LivreRecherche from '@/components/LivreRecherche'
import { ThemedView } from '@/components/ThemedView';

import { apiLink } from '@/constants/Api';
import { Book } from '../models/Book';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { useInfiniteQuery } from 'react-query'

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


const fetchBooks = async (query: String, offset: number = 0) => {
	const response = fetch(apiLink + query + "&startIndex=" + (offset.toString()));
	return (await response).json();
}

const BookList = (query: String) => {
	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage
	} = useInfiniteQuery('boooks', fetchBooks)
}

export default function HomeScreen() {
	const [bookList, setBookList] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false)
	const [isListEnd, setIsListEnd] = useState(false)
	const [lastQuery, setLastQuery] = useState("bite");
	const flatListRef = useRef<FlatList<Book>>(null)



	const renderFooter = () => {
		return (
			// Footer View with Loader
			<View style={styles.footer}>
				{loading ? (
					<ActivityIndicator
						color="black"
						style={{ margin: 15 }} />
				) : null}
			</View>
		);
	};

	const getListBookFromQuery = (query?: string) => {

		if (!loading && !isListEnd) {
			setLoading(true);
			fetch(apiLink + (query ? query : lastQuery) + "&startIndex=" + (query ? "0" : bookList.length.toString()))
				.then(response => response.json())
				.then(json => {

					if (json.items.length > 0) {
						// After the response increasing the offset 	
						if (query == null) {
							setBookList([...bookList, ...json.items]);
							console.log("caca", "lastQuery : " + lastQuery)


						} else {

							flatListRef.current?.scrollToIndex({ index: 0, animated: null });
							setBookList(json.items);
							setLastQuery(query);
							console.log("pipi", "lastQuery : " + lastQuery);

						}
						setLoading(false);
					} else {
						setIsListEnd(true);
						setLoading(false);
					}


				}).catch((error) => {
					console.log("Erreur API", error)
				})
		}
	}


	const fetchBook = async (offset)

	return (

		<ThemedView style={styles.body}>
			{/* <ScrollView style={styles.dataTableContainer} stickyHeaderIndices={[0]}>
				<SearchBar qrcode={true} onChangeEvent={getListBookFromQuery}></SearchBar>
				{bookList ? (bookList.map((book, index) => (
					<LivreRecherche key={index} cover={book.volumeInfo.imageLinks} title={book.volumeInfo.title} writter={book.volumeInfo.authors}></LivreRecherche>
					// test(book, index)
				))) : (<Text>Loading...</Text>
				)}
			</ScrollView> */}
			<SafeAreaProvider>

				<SafeAreaView>


					<SearchBar qrcode={true} onChangeEvent={getListBookFromQuery}></SearchBar>
					<FlatList
						ref={flatListRef}
						style={styles.dataTableContainer}
						data={bookList}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => <LivreRecherche cover={item.volumeInfo.imageLinks} title={item.volumeInfo.title} writter={item.volumeInfo.authors}></LivreRecherche>}
						onEndReachedThreshold={0}
						onEndReached={(info) => {
							console.log("caca trggered");
							if (!loading) {
								getListBookFromQuery();
							}
						}}
						ListFooterComponent={renderFooter}
					/>

				</SafeAreaView>
			</SafeAreaProvider>

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
	footer: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
});