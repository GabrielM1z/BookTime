import { FlatList, Modal, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import React, { useState } from 'react';
import { ThemedButton } from './ThemedButton';
import { Library } from '@/models/Library';
import { useRepository } from '@/hooks/useRepository';

export default function LibraryChoice() {

    const [modalVisible, setModalVisible] = useState(false);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const {libraryRepository} = useRepository();

    // Fonction pour récupérer les bibliothèques depuis la BDD
    const fetchLibraries = async () => {
        try {
            const data = await libraryRepository.getAll();
            setLibraries(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des bibliothèques:', error);
        }
    };

    // Ouvre le modal et charge les bibliothèques
    const openModal = () => {
        fetchLibraries();
        setModalVisible(true);
    };

    // Gère la sélection d’une bibliothèque
    const selectLibrary = (id_library: string) => {
        console.log('Bibliothèque sélectionnée:', id_library);
        setModalVisible(false);
    };

    
    return (
        <View style={styles.container}>
            <ThemedButton type="like" onPress={() => console.log('Ajouté aux favoris !')} />
            <ThemedButton type="toRead" onPress={() => console.log('Ajouté à la liste de lecture !')} />

            {/* Bouton "+" pour ouvrir le modal */}
            <ThemedButton type="default" title="Autre" onPress={openModal} />

            {/* Modal pour afficher les bibliothèques */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choisissez une bibliothèque</Text>
                        <FlatList
                            data={libraries}
                            keyExtractor={(item) => item.id_library}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.libraryItem} onPress={() => selectLibrary(item.id_library)}>
                                    <Text style={styles.libraryText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <ThemedButton type="default" title="Fermer" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    plusButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    libraryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    libraryText: {
        fontSize: 16,
    },
});

export { LibraryChoice };
