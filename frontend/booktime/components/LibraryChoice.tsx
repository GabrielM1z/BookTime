import { FlatList, Modal, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Library } from '@/models/Library';
import { useRepository } from '@/hooks/useRepository';
import LibraryChip from './LibraryChip';


export default function LibraryChoice({ book }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [librariesNotOwn, setLibrariesNotOwn] = useState<Library[]>([]);
    const [librariesOwn, setLibrariesOwn] = useState<Library[]>([]);
    const { libraryRepository, bookRepository } = useRepository();

    useEffect(() => {
        if (book) {
            fetchLibrariesNotOwn();
            fetchLibrariesOwn();
        }
    }, [book]);

    const fetchLibrariesOwn = () => {
        try {
            if (book?.id_book && typeof book.id_book === 'string') {
                libraryRepository.getAllLibraryFromBook(book.id_book).then((data) => {
                    setLibrariesOwn(data);
                });
            } else if (book?.id_book) {
                console.error("Invalid id_book:", book.id_book);
            }
        } catch (error) {
            console.error('Error fetching library own:', error);
        }
    };

    const fetchLibrariesNotOwn = () => {
        try {
            libraryRepository.getAllNotLibraryFromBook(book.id_book).then((data) => {
                setLibrariesNotOwn(data);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des bibliothèques:', error);
        }
    };

    const openModal = () => {
        fetchLibrariesNotOwn();
        setModalVisible(true);
    };

    const selectLibrary = (id_library: string) => {
        // Logique pour ajouter une bibliothèque à un livre
        bookRepository.addBookToLibrary(id_library, book).then(() => {
            fetchLibrariesOwn();
            fetchLibrariesNotOwn();
        });
        setModalVisible(false);
    };

    const deleteLibrary = (id_library: string) => {
        // Logique pour supprimer une bibliothèque
        bookRepository.delBookFromLibrary(id_library, book.id_book).then(() => {
            fetchLibrariesOwn();
            fetchLibrariesNotOwn();
        });
    };

    return (
        <View style={styles.container}>
            {librariesOwn.map((lib) => (
                <LibraryChip
                    key={lib.id_library}
                    title={lib.name}
                    onDelete={() => deleteLibrary(lib.id_library)}
                />
            ))}

            <TouchableOpacity style={styles.plusButton} onPress={openModal}>
                <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choisissez une bibliothèque</Text>
                        <FlatList
                            data={librariesNotOwn}
                            keyExtractor={(item) => item.id_library}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.libraryItem} onPress={() => selectLibrary(item.id_library)}>
                                    <Text style={styles.libraryText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Fermer</Text>
                        </TouchableOpacity>
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
        backgroundColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusText: {
        color: 'white',
        fontSize: 24,
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
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
});

export { LibraryChoice };
