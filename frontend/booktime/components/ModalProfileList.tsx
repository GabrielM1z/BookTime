import { View, StyleSheet, Text, Button } from 'react-native';
import React, { forwardRef, useMemo } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useAuth } from '@/hooks/useAuth';
export type Ref = BottomSheetModal;

export const ModalProfileList = forwardRef<Ref>((props, ref) => {
	const snapPoints = useMemo(() => ['50%', '75%'], []);
	const { logOut } = useAuth(); 

	return (
		<BottomSheetModal ref={ref} index={1} snapPoints={snapPoints}>
			<BottomSheetView style={styles.contentContainer}>
				<Text>Awesome 🎉</Text>
				<Button title='Log out' onPress={logOut} />
			</BottomSheetView>
		</BottomSheetModal>
	);
});

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: 'center'
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: '600',
		padding: 20
	}
});
