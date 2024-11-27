import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const libraryStyles = StyleSheet.create({
    container: {
		flex: 1,
	},
	etagereContainer: {
		flexDirection: 'column',
	},
	btn: {
		backgroundColor: Colors.dark.primary,
		borderColor: Colors.dark.secondary,
		borderWidth: 2,
		borderRadius: 100,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginRight: 5,
		marginTop: 5,
	},
	activeBtn: {
		backgroundColor: Colors.dark.secondary,
		borderColor: Colors.dark.secondary,
		borderWidth: 2,
		borderRadius: 100,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginRight: 5,
		marginTop: 5,
	},
	containerBtn: {
		flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default libraryStyles;