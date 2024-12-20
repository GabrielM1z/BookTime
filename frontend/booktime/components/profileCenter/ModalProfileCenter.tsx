import { useAuth } from '@/hooks/useAuth';
import { useRepository } from '@/hooks/useRepository';
import { User } from '@/models/User';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetModal, BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { Href, useRouter } from 'expo-router';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomBottomSheet, OpacityBackgroundBottomSheet } from '.';
import TouchableScale from '../TouchableScale';
import { ProfileItem } from './ProfileItem.component';


export interface ProfileCenterProps {
    onChange?: (index: number) => void;
};

export const ModalProfileCenter = forwardRef<BottomSheetModal>((props, ref) => {
    const router = useRouter();
    const { dismiss } = useBottomSheetModal();
    const subModalRef = useRef<BottomSheetModal>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

    const { sessionRepository } = useRepository();
    const { switchSession, logOut } = useAuth();

    // Mock data des utilisateurs
    const users = [
        new User({ id: '1', givenName: 'John', familyName: 'Doe', emailVerified: true, username: 'johndoe', email: '' }),
        new User({ id: '2', givenName: 'Jane', familyName: 'Doe', emailVerified: true, username: 'janedoe', email: '' }),
        new User({ id: '3', givenName: 'Alice', familyName: 'Smith', emailVerified: true, username: 'alicesmith', email: '' }),
        new User({ id: '4', givenName: 'Bob', familyName: 'Smith', emailVerified: true, username: 'bobsmith', email: '' }),
    ];

    const handleMenuClicked = useCallback(() => {
        subModalRef.current?.present();
    }, [subModalRef]);

    const handleAddAccount = () => console.log('Add account');
    const handleAccountsCenter = () => {
        dismiss();
        router.push('/settings' as Href<"settings">);
    };

    return (
        <>
            <OpacityBackgroundBottomSheet isOpen={[isFirstModalOpen, isSecondModalOpen]} />
            <CustomBottomSheet ref={ref} setIsOpen={setIsFirstModalOpen}>
                <BottomSheetFlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => ProfileItem({
                        item,
                        isSelected: item.id == selectedUserId,
                        onItemClicked: setSelectedUserId,
                        onMenuClicked: handleMenuClicked,
                    })}
                    style={styles.profileContainer}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => (
                        <TouchableScale style={[styles.profileItem, { paddingBottom: 8 }]} onPress={handleAddAccount}>
                            <View style={styles.addProfileCircle}>
                                <Ionicons name="add" size={28} color="#000" />
                            </View>
                            <Text style={styles.addAccountText}>Add account</Text>
                        </TouchableScale>
                    )}
                />
                <View>
                    <TouchableOpacity style={styles.settingsButton} onPress={handleAccountsCenter}>
                        <Text style={styles.settingsText}>Settings</Text>
                    </TouchableOpacity>
                </View>
            </CustomBottomSheet>
            <CustomBottomSheet ref={subModalRef} setIsOpen={setIsSecondModalOpen}>
                <BottomSheetView>
                    <TouchableOpacity style={styles.settingsButton} onPress={logOut}>
                        <Text style={styles.settingsText}>LogOut</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </CustomBottomSheet>
        </>
    );
});


const styles = StyleSheet.create({
    profileContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 8,
        margin: 8,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    settingsButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 8,
        marginBottom: 8,
    },
    settingsText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
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
});
