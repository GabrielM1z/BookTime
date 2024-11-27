import { StyleSheet, Text, View, Image, ScrollView, FlatList, ActivityIndicator, VirtualizedList, RefreshControl } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { SearchBar } from '@/components/SearchBar';
import TitreTab from '@/components/TitreTab';
import { LivreRecherche } from '@/components/LivreRecherche'
import { ThemedView } from '@/components/ThemedView';

import { useInfiniteScroll } from '@/core/api';
import { Book } from '../models/Book';
import { apiLink } from '@/constants/Api';
import { SafeAreaView } from 'react-native-safe-area-context';


type TFilters = {
	q: string;
};

type TBook = {
	items: Book[];
	kind: string;
	totalItems: number;
}


const removeDuplicates = (items: Book[]): Book[] => {
	const seenIds = new Set<string>();
	return items.filter((item) => {
		if (seenIds.has(item.id)) {
			return false;
		} else {
			seenIds.add(item.id);
			return true;
		}
	});
};


export default function HomeScreen() {
	const [filters, setFilters] = useState<TFilters>({
		q: '',
	});

	const searchBarChanged = (searchTerms: string) => {
		setFilters({
			...filters,
			q: searchTerms,
		});
	}

	const {
		data,
		isRefreshing,
		onRefresh,
		onEndReached,
		isFetchingNextPage
	} = useInfiniteScroll<Book, TFilters>({
		url: apiLink,
		limit: 10,
		filters: filters,
		key: 'books',
		initialPage: 0,
		formatResponse: (data: TBook) => data.items,
	});

	return (
		<ThemedView style={styles.body}>
			<SafeAreaView>
				<SearchBar qrcode={true} onSearch={searchBarChanged} />
				<FlatList
					contentContainerStyle={styles.contentContainerStyle}
					// keyExtractor={item => `${item.id}+${item.etag}`}
					keyExtractor={item => item.id}
					initialNumToRender={10}
					data={removeDuplicates(data)}
					onEndReached={onEndReached}
					removeClippedSubviews={true}
					// refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
					renderItem={({ item }) => <LivreRecherche book={item} />}
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
	// listFooterComponent: {
	// 	padding: 10,
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// 	flexDirection: 'row',
	// },
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
