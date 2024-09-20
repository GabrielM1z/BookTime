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

export const Colors = {
	light: {
		text: '#11181C',
		background: '#fff',
		tint: tintColorLight,
		icon: '#687076',
		tabIconDefault: '#687076',
		tabIconSelected: tintColorLight,
		primary: '#000000',
		secondary: '#000000',
	},
	dark: {
		text: theme.logoWhite,
		background: theme.logoDeepBlue,
		tint: tintColorDark,
		icon: '#9BA1A6',
		tabIconDefault: '#9BA1A6',
		tabIconSelected: tintColorDark,
		primary: theme.logoDeepBlue,
		secondary: theme.logoBlue,
	},
};
