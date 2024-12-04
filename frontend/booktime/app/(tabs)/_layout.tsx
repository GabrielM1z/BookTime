import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
		screenOptions={{
			tabBarActiveTintColor: Colors.dark.background,
			headerShown: false,
			tabBarShowLabel: false,
			tabBarStyle: {
				position: "absolute",
				bottom: 27,
				marginLeft: 16,
				marginRight: 16,
				elevation: 0,
				borderRadius: 30,
				alignItems: "center",
				justifyContent: "center",
			}
		}}>
			<Tabs.Screen
				name="index"
				options={{
				title: 'Accueil',
				tabBarIcon: ({ color, focused }) => (
					<TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
				),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
				title: 'Rechercher',
				tabBarIcon: ({ color, focused }) => (
					<TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
				),
				}}
			/>
			<Tabs.Screen
				name="library"
				options={{
				title: 'Bibliothèque',
				tabBarIcon: ({ color, focused }) => (
					<TabBarIcon name={focused ? 'library' : 'library-outline'} color={color} />
				),
				}}
			/>
			<Tabs.Screen
				name="news"
				options={{
				title: 'Nouveauté',
				tabBarIcon: ({ color, focused }) => (
					<TabBarIcon name={focused ? 'mail' : 'mail-outline'} color={color} />
				),
				}}
			/>
			<Tabs.Screen
				name="profil"
				options={{
				title: 'Profil',
				tabBarIcon: ({ color, focused }) => (
					<TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />
				),
				}}
			/>
			
			{/* tab invisible sur la nav bar */}
			<Tabs.Screen
				name="book/[idBook]"
				options={{
					title: 'Book',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />
					),
					href: null,
				}}
			/>
			<Tabs.Screen
				name="author/[idAuthor]"
				options={{
					title: 'Author',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />
					),
					href: null,
				}}
			/>
		</Tabs>
		
	);
}
