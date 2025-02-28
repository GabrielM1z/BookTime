import React, { useCallback, useMemo, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { BottomSheetModal } from '@/common';


const ManageLibraryModal = () => {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <BottomSheetModal>
            <BottomSheetView style={styles.contentContainer}>
                <Text>Awesome 🎉</Text>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default ManageLibraryModal;
