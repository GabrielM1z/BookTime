import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { LivreRecherche } from '@/components/recherche/LivreRecherche'
import { ThemedView } from '@/components/ThemedView';

import { useInfiniteScroll } from '@/core/api';
// import { Book } from '@/models/Book';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { BookInfosSearch, BookInfosServeur } from '@/models/Book';
import { useRepository, useRepositoryContext } from '@/hooks/useRepository';
import { ModalAddToLibrary } from '@/components/recherche/ModalAddToLibrary';
import BottomSheet, { BottomSheetModal, BottomSheetSectionList, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button } from 'react-native-paper';
import { CustomBottomSheet } from '@/components/bottomSheets/CustomBottomSheet';
import { Library } from '@/models';

//Filtres appliqué à la recherche API
type TFilters = {
	query: string;
};

// ISBN différents smais id Google Book dupliqué 
// !!!!! SOLUTION TEMPORAIRE !!!!!
const removeDuplicates = (items: BookInfosSearch[]): BookInfosSearch[] => {
	const seenIds = new Set<string>();
	return items.filter((item) => {
		if (seenIds.has(item.isbn13)) {
			return false;
		} else {
			seenIds.add(item.isbn13);
			return true;
		}
	});
};



export default function HomeScreen() {
	const [filters, setFilters] = useState<TFilters>({
		query: '',
	});

	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = useCallback(() => {
		console.log("bottomSheetRef.current", bottomSheetRef.current); // Vérifier si la ref n'est pas null
		bottomSheetRef.current?.present();
	}, []);


	const searchBarChanged = (searchTerms: string) => {
		setFilters({
			...filters,
			query: searchTerms,
		});
	}

	const {
		data,
		isRefreshing,
		onRefresh,
		onEndReached,
		isFetchingNextPage
	} = useInfiniteScroll<BookInfosSearch, TFilters>({
		url: "/books/search/",
		limit: 10,
		filters: filters,
		key: 'books',
		initialPage: 0,
		// formatResponse: (data: TBook) => data.items,
	});

	return (
		<SafeAreaView >

			<SearchBar qrcode={true} onSearch={searchBarChanged} />
			{/* Button icon="camera" mode="contained" onPress={() => handlePresentModalPress()}>
				Press me
			</Button>< */}


			<ModalAddToLibrary ref={bottomSheetRef} />

			<FlatList
				contentContainerStyle={styles.contentContainerStyle}
				// keyExtractor={item => `${item.id}+${item.etag}`}
				keyExtractor={item => item.isbn13}
				initialNumToRender={10}
				data={removeDuplicates(data)}
				// data={data}
				onEndReached={onEndReached}
				removeClippedSubviews={true}
				// refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
				renderItem={({ item }) => <LivreRecherche book={item} handleModalAddToLibrary={handlePresentModalPress} />}
				ListEmptyComponent={
					<View style={styles.listEmptyComponent}>
						<Text>{'noResult'}</Text>
					</View>
				}
				ListFooterComponent={
					<View style={styles.listFooterComponent}>
						{isFetchingNextPage && <ActivityIndicator />}
					</View>
				}
			/>

		</SafeAreaView>
	);
}


const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
	// 	padding: 24,
	// 	justifyContent: 'center',
	// 	backgroundColor: 'grey',
	// },
	dataTableContainer: {
		marginHorizontal: "5%",
		marginTop: "5%",
		flexDirection: "column",
	},
	listEmptyComponent: {
		flexDirection: 'row',
	},
	listFooterComponent: {
		flexDirection: 'row',
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	item: {
		height: 60,
		width: '100%',
	},
	contentContainerStyle: {
		marginTop: 10,
		padding: 10,
	},

});
