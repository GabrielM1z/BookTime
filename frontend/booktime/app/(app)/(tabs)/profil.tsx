import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import { useSession } from '@/context/auth';

// import des component
import ImageViewer from '@/components/ImageViewer';
import Button from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// import d'une image
const PlaceholderImage = require('@/assets/images/profil.png');
const profilImage = require('@/assets/images/profil.png');
const bannerImage = require('@/assets/images/banner.jpg');

// fonction par défaut
export default function App() 
{
	const [selectedImage, setSelectedImage] = useState(null);

	const pickImageAsync = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});
		
		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
		} else {
			alert('You did not select any image.');
		}
	};

	const { signOut } = useSession();
	
    return (
		<ThemedView style={styles.container}>
			<Image source={bannerImage} style={styles.bannerImage} />
			<Image source={profilImage} style={styles.profilImage} />
			
			<View style={styles.pseudoContainer}>
				<ThemedText type="pseudo">MARTINEZ Gabriel</ThemedText>
			</View>

			<View style={styles.badgeContainer}>
				<Text style={styles.badgeTexte}>Badges</Text>
			</View>
			
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text
					onPress={() => {
						// The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
						signOut();
						
					}}>
					Sign Out
				</Text>
			</View>
	
			<StatusBar style="auto" />
		</ThemedView>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	pseudoContainer: {
		position: 'absolute',
		top: 230,
		left: 150,
		backgroundColor: 'rgba(0,0,0,0.7)',
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 20,
    	padding: 5,
	},
	badgeTexte: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
	},
	badgeContainer: {
		margin: 20,
		borderColor: 'white',
    	padding: 5,
	},
	bannerImage: {
		width: '100%',
		height: 300,
	},
	profilImage: {
		position: 'absolute',
		top: 130,
		left: 20,
		width: 150,
		height: 150,
		borderRadius: 100,
	},
	footerContainer: {
		flex: 1 / 3,
		alignItems: 'center',
	},
});