import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	type?: 'default' | 'titreTab' 
	| 'titreEtagere' | 'titreLivreHorizontal' 
	| 'auteurLivreHorizontal' | 'titreLivreVertical'
	| 'pseudo' | 'sousTab';
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedTextProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	return (
		<Text
		style={[
			{ color },
			type === 'default' ? styles.default : undefined,
			type === 'titreTab' ? styles.titreTab : undefined,
			type === 'titreEtagere' ? styles.titreEtagere : undefined,
			type === 'titreLivreHorizontal' ? styles.titreLivreHorizontal : undefined,
			type === 'auteurLivreHorizontal' ? styles.auteurLivreHorizontal : undefined,
			type === 'titreLivreVertical' ? styles.titreLivreVertical : undefined,
			type === 'pseudo' ? styles.pseudo : undefined,
			type === 'sousTab' ? styles.sousTab : undefined,
			style,
		]}
		{...rest}
		/>
    );
}

const styles = StyleSheet.create({
	default: {
		fontSize: 16,
		lineHeight: 24,
	},
	titreTab: {
		fontSize: 40,
		fontWeight: 'bold',
	},
	titreEtagere: {
		fontSize: 20,
		fontWeight: 'bold',
		backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 10,
		padding: 5,
		alignSelf: 'flex-start',
	},
	titreLivreHorizontal: {
		fontSize: 18,
		width: "100%"
	},
	auteurLivreHorizontal: {
		fontSize: 17,
      	color: "gray",
	},
	titreLivreVertical: {
		fontSize: 15,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	pseudo: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	sousTab: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	
});
