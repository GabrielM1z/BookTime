import { useBookContext } from '@/contexts/BookContext';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

const AddLibraryModal = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const bookController = useBookContext();
    const [libraryName, setLibraryName] = useState<string>('');

    const handleAddLibrary = useCallback(async () => {
        if (libraryName.trim()) {
            await bookController.createLibrary({ name: libraryName });
            setLibraryName('');
            handleClose();
        } else {
            alert('Please enter a valid library name.');
        }
    }, [libraryName]);

    const handleClose = useCallback(() => {
        router.back();
    }, []);

    return (
        // TODO: voir la lib https://github.com/react-native-modal/react-native-modal
        <Modal visible animationType="slide" transparent={true} onRequestClose={handleClose}>
            <View style={[styles.modalBackground, { backgroundColor: colors.backdrop }]}>
                <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.title]} variant='titleMedium'>Add New Library</Text>

                    <TextInput
                        placeholder="Enter library name"
                        value={libraryName}
                        autoFocus
                        onChangeText={setLibraryName}
                    />

                    <View style={styles.buttonsContainer}>
                        <Button onPress={handleClose}>Cancel</Button>
                        <Button mode='contained' onPress={handleAddLibrary}>Add Library</Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        borderRadius: 8,
        elevation: 5,
        gap: 12,
    },
    title: {
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default AddLibraryModal;
