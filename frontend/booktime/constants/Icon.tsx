import { Feather } from "@expo/vector-icons";
import { Colors } from "./Colors";
import React from "react";

export const icon = {
	index: (props: any) => 
		<Feather name='home' size={24} color={Colors.dark.text} {...props}/>,
	library: (props: any) => 
		<Feather name='book' size={24} color={Colors.dark.text} {...props}/>,
	search: (props: any) => 
		<Feather name='search' size={24} color={Colors.dark.text} {...props}/>,
	news: (props: any) => 
		<Feather name='mail' size={24} color={Colors.dark.text} {...props}/>,
	profile: (props: any) => 
		<Feather name='user' size={24} color={Colors.dark.text} {...props}/>,
}