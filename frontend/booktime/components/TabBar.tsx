import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import { Colors } from "@/constants/Colors";
import TabBarButton from "./TabBarButton";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";


export function TabBar ({ state, descriptors, navigation} : BottomTabBarProps)
{
	const [dimension, setDimensions] = useState({height: 20, width: 100});

	const buttonWidth = dimension.width / (state.routes.length-2);
	const gap = (dimension.width - buttonWidth * (state.routes.length-2));

	console.log("taille : ", dimension.width, buttonWidth, gap, state.routes.length)

	const onTabBarLayout = (e: LayoutChangeEvent) => {
		setDimensions({
			height: e.nativeEvent.layout.height,
			width: e.nativeEvent.layout.width,
		})
	}

	const tabPositionX = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {transform: [{translateX: tabPositionX.value}]}
	});

	return (
		<View onLayout={onTabBarLayout} style={styles.tabbar}>
			<Animated.View style={[animatedStyle,{
				position: 'absolute',
				backgroundColor: Colors.dark.primary,
				borderRadius: 30,
				marginLeft: 10,
				height: dimension.height - 15,
				width: buttonWidth -20
			}]}/>
			{state.routes
				.filter(route => route.name !== 'index' && !route.name.includes('style'))
				.map((route, index) => {
				const {options} = descriptors[route.key];
				const label =
					typeof options.tabBarLabel === 'string'
						? options.tabBarLabel
						: typeof options.title === 'string'
						? options.title
						: route.name;
				
				const isFocused = state.index === index;

				const onPress = () => {
					tabPositionX.value = withSpring((buttonWidth) * index, {duration: 1500})
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
					<TabBarButton
						key={route.name}
						onPress={onPress}
						onLongPress={onLongPress}
						isFocused={isFocused}
						routeName={route.name}
						color={isFocused ? '#673ab7' : Colors.dark.text}
						label={label}
					>	
					</TabBarButton>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	tabbar: {
		position: 'absolute',
		bottom: 0,
		marginHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: Colors.dark.secondary,
		paddingVertical: 15,
		borderRadius: 35,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 10},
		shadowRadius: 10,
		shadowOpacity : 0.1,
	}
})