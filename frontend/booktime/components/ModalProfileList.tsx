// import { View, StyleSheet, Text, Button } from 'react-native';
// import React, { forwardRef, useMemo } from 'react';
// import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
// import { useAuth } from '@/hooks/useAuth';
// import { useRepository } from '@/hooks/useRepository';
// export type Ref = BottomSheetModal;

// export const ModalProfileList = forwardRef<Ref>((props, ref) => {
// 	const snapPoints = useMemo(() => ['50%', '75%'], []);
// 	const { logOut } = useAuth();
// 	const { sessionRepository } = useRepository();

// 	return (
// 		<BottomSheetModal ref={ref} index={1} snapPoints={snapPoints} bottomInset={8} detached style={styles.sheetContainer}>
// 			<BottomSheetView style={styles.contentContainer}>
// 				<Text>Awesome 🎉</Text>
// 				<Button title='Log out' onPress={logOut} />
// 				<View style={styles.profileContainer}>
// 					<Text>Bottom Modal 😎</Text>
// 				</View>
// 			</BottomSheetView>
// 		</BottomSheetModal>
// 	);
// });

// const styles = StyleSheet.create({
// 	sheetContainer: {
// 		marginHorizontal: 8,
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 5,
// 		},
// 		shadowOpacity: 0.34,
// 		shadowRadius: 6.27,

// 		elevation: 10,
// 	},
// 	contentContainer: {
// 		flex: 1,
// 		alignItems: 'center'
// 	},
// 	profileContainer: {
// 		flex: 1,
// 		// justifyContent: 'center',
// 		// alignItems: 'center',
// 		backgroundColor: 'green',
// 		borderRadius: 10,
// 	},
// });





import React, { forwardRef, useMemo } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';


const profileImage = require('@/assets/images/profil.png');

export type Ref = BottomSheetModal;

export interface ModalProfileListProps {
	onChange?: (index: number) => void;
};

export const ModalProfileList = forwardRef<Ref, ModalProfileListProps>((props, ref) => {
	const snapPoints = useMemo(() => ['50%'], []);

	// Mock data des utilisateurs
	const users = [
		{ id: 1, name: 'user 1', profilePicture: 'https://example.com/user1.jpg', selected: true },
		{ id: 2, name: 'user 2', profilePicture: 'https://example.com/user2.jpg', selected: false },
	];

	const handleAddAccount = () => console.log('Add account');
	const handleAccountsCenter = () => console.log('Go to Accounts Center');

	return (
		<BottomSheetModal
			ref={ref}
			onChange={props.onChange}
			index={0}
			snapPoints={snapPoints}
			bottomInset={8}
			detached
			style={styles.sheetContainer}
		>
			<BottomSheetView style={styles.contentContainer}>
				{/* Conteneur gris pour les profils */}
				<View style={styles.profileContainer}>
					{/* Liste des comptes */}
					{users.map((user) => (
						<View key={user.id} style={styles.profileItem}>
							{/* <Image source={{ uri: user.profilePicture }} style={styles.profileImage} /> */}
							<Image source={profileImage} style={styles.profileImage} />
							<View style={styles.profileTextContainer}>
								<Text style={styles.profileName}>{user.name}</Text>
								{/* {user.id === 2 && <Text style={styles.subText}>• 1 chat and 1 more</Text>} */}
							</View>
							{user.selected && (
								<Ionicons name="checkmark-circle" size={24} color="#007AFF" style={styles.checkIcon} />
							)}
						</View>
					))}

					{/* Ajouter un compte */}
					<TouchableOpacity style={[styles.profileItem, { marginBottom: 0 }]} onPress={handleAddAccount}>
					<View style={styles.addProfileCircle}>
						<Ionicons name="add" size={28} color="#000" />
					</View>
					<Text style={styles.addAccountText}>Add Instagram account</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={styles.settingsButton} onPress={handleAccountsCenter}>
				<Text style={styles.settingsText}>Settings</Text>
			</TouchableOpacity>
		</BottomSheetView>
		</BottomSheetModal >
	);
});

const styles = StyleSheet.create({
	sheetContainer: {
		marginHorizontal: 8,
		backgroundColor: '#fff',
		borderRadius: 12,
	},
	contentContainer: {
		flex: 1,
		padding: 16,
	},
	profileContainer: {
		backgroundColor: '#F5F5F5', // Fond gris clair
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
	},
	profileItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 12,
	},
	profileTextContainer: {
		flex: 1,
	},
	profileName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000',
	},
	subText: {
		fontSize: 12,
		color: '#888',
	},
	checkIcon: {
		marginLeft: 'auto',
	},
	addProfileCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#E0E0E0',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	addAccountText: {
		fontSize: 16,
		color: '#000',
		fontWeight: 'bold',
	},
	settingsButton: {
		backgroundColor: '#F0F0F0',
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
		marginTop: 12,
	},
	settingsText: {
		fontSize: 16,
		color: '#007AFF',
		fontWeight: 'bold',
	},
});
