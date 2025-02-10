/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const theme = {
	logoWhite: '#fafafb',
	logoBlue: '#1e9aa4',
	logoMidBlue: '#0c3952',
	logoDeepBlue: '#191a32',
}

export const libraryColors = [
	'#ff6961',
	'#77dd77',
	'#84b6f4'
]

export const Colors = {
	light: {
		primary: theme.logoDeepBlue,
		secondary: theme.logoBlue,
		background: '#fff',
		surface: '#000000',
		text: '#11181C',
		textMuted: '#6B7280',
		error: '#B00020',
		warning: '#FFA000',
		success: '#388E3C',
		info: '#1976D2',
		border: '#E0E0E0',
		disabled: '#9E9E9E',	
	},
	dark: {
		primary: theme.logoDeepBlue,
		secondary: theme.logoBlue,
		background: theme.logoDeepBlue,
		surface: '#000000',
		text: theme.logoWhite,
		textMuted: '#6B7280',
		error: '#B00020',
		warning: '#FFA000',
		success: '#388E3C',
		info: '#1976D2',
		border: '#E0E0E0',
		disabled: '#9E9E9E',
	},
};


/**
 * - primary	: Couleur principale utilisée pour les actions, boutons, ou éléments proéminents.
 * - secondary	: Couleur secondaire utilisée pour les accents ou les éléments complémentaires.
 * - background	: Couleur de fond principale
 * - surface 	: Couleur des surfaces surélevées (cartes, menus).
 * - text   	: Couleur pour le texte principal.
 * - textMuted  : Couleur pour les textes ou icônes moins importants.
 * - error 		: Couleur pour les erreurs
 * - warning 	: Couleur pour les erreurs
 * - success 	: Couleur pour les succes
 * - info 		: Couleur pour les info
 * - border 	: Couleur pour les bordures
 * - disabled	: Couleur pour les éléments disabled
*/ 

