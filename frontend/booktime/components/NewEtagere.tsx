import React, { useState } from 'react';
import TitreTab from "./TitreTab";
import { Modal, TouchableOpacity, View, StyleSheet, TextInput, Text } from "react-native";
import { Colors } from '@/constants/Colors';
import { addLibrary } from '@/db/db-etagere';
import { useSQLiteContext } from 'expo-sqlite';


export default function NewEtagere({ onAddEtagere })
{
	const [isModalVisible, setModalVisible] = useState(false);
	const [formData, setFormData] = useState({
		name: ''
	});
	const db = useSQLiteContext();

	const handleInputChange = (field: any, value: any) => {
		setFormData({ name: value });
	};

	const handleSubmit = async () => {
		try {
            console.log('Form Data Submitted:', formData);
            await addLibrary(db, formData.name); // Ajoute l'étagère à la base de données
            setModalVisible(false); // Ferme la popup après soumission
            onAddEtagere(); // Notifie le parent pour rafraîchir la liste des étagères
        } catch (error) {
            console.error('Error adding etagere:', error);
        }
	};
	

    return (
        <View>
            <TouchableOpacity style={styles.openButton} onPress={() => setModalVisible(true)}>
				<TitreTab label={"ADD +"}></TitreTab>
			</TouchableOpacity>

			<Modal
				animationType='fade'
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Formulaire</Text>

						{/* Formulaire */}
						<TextInput
							style={styles.input}
							placeholder="Nom"
							value={formData.name}
							onChangeText={(value) => handleInputChange('name', value)}
						/>

						{/* Boutons */}
						<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.buttonText}>Annuler</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.submitButton}
							onPress={handleSubmit}
						>
							<Text style={styles.buttonText}>Soumettre</Text>
						</TouchableOpacity>
						</View>
					</View>
				</View>

			</Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    etagereContainer: {
		alignSelf: 'center',
		width: '90%',
		marginTop: 10,
		marginBottom: 10,
		padding:10,
		borderRadius:20,
    },
	titreContainer: {
		marginBottom: 5,
    },
    livresContainer: {
		flexDirection: 'row',
  	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
	},
	openButton: {
		alignSelf: 'center',
		width: '90%',
		padding: 10,
		borderRadius: 20,
		marginTop: 10,
		marginBottom: 10,
		borderColor: Colors.dark.secondary,
		borderWidth: 5, 
		borderStyle: 'dashed',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
	  },
	  modalContent: {
		width: '80%',
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 20,
		alignItems: 'center',
	  },
	  modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	  },
	  input: {
		width: '100%',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		fontSize: 16,
	  },
	  buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	  },
	  closeButton: {
		flex: 1,
		backgroundColor: '#6c757d',
		padding: 10,
		borderRadius: 5,
		marginRight: 10,
		alignItems: 'center',
	  },
	  submitButton: {
		flex: 1,
		backgroundColor: '#007BFF',
		padding: 10,
		borderRadius: 5,
		marginLeft: 10,
		alignItems: 'center',
	  },
});