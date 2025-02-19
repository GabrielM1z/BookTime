import React, { useState } from 'react';
import TitreTab from "./TitreTab";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
import { useRepositoryContext } from '@/hooks/useRepository';
import { BookAllInfos } from '@/models/Book';


export default function TestBtn({})
{
	const { bookRepository, libraryRepository } = useRepositoryContext();
	
	const book1: BookAllInfos = {
		id_book: '1',
		title: 'TEST',
		description: 'loremipsum description',
		publisher: 'publisher',
		publication_date: '01-01-2001',
		page_number: 50,
		language: 'FR',
		cover_image_url: 'test.png',
	}

	const handleSubmit = async () => {
		try {
	
			await bookRepository.add(book1)
			const result = await bookRepository.getAll()
			console.log(result);
			
        } catch (error) {
            console.error('Error : ', error);
        }
	};
	

    return (
        <View>
            <TouchableOpacity style={styles.openButton} onPress={() => handleSubmit()}>
				<TitreTab label={"test"}></TitreTab>
			</TouchableOpacity>
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