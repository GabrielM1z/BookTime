import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";


export function TabBar ({ state, descriptors, navigation} : BottomTabBarProps){

	const icon = {
		library: (props: any) => <Feather name='book' size={24} color={Colors.dark.text} {...props}/>,
		search: (props: any) => <Feather name='search' size={24} color={Colors.dark.text} {...props}/>,
		news: (props: any) => <Feather name='mail' size={24} color={Colors.dark.text} {...props}/>,
		profil: (props: any) => <Feather name='user' size={24} color={Colors.dark.text} {...props}/>,
	}

	return (
		<View style={styles.tabbar}>
			{state.routes.map((route, index) => {
				const {options} = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;
				
				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					})
				}

				return (
					<TouchableOpacity
						key={route.name}
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={styles.tabbarItem }
					>
						{icon[route.name]({
							color: isFocused ? '#673ab7' : Colors.dark.text
						})}
						<Text style={{ color: isFocused ? '#673ab7' : Colors.dark.text }}>
							{label}
						</Text>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	tabbar: {
		position: 'absolute',
		bottom: 50,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: Colors.dark.secondary,
		marginHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 35,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 10},
		shadowRadius: 10,
		shadowOpacity : 0.1,
	},
	tabbarItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 5,
	}
})