import { useAuth } from '@/hooks/useAuth';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView, useBottomSheetModal, BottomSheetFlatList, BottomSheetFooterProps, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { Href, useRouter } from 'expo-router';
import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import TouchableScale from '../TouchableScale';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomBottomSheet, OpacityBackgroundBottomSheet } from '.';
import { ProfileItem } from './ProfileItem.component';
import { User } from '@/models/User';


export type Ref = BottomSheetModal;

export interface ProfileCenterProps {
    onChange?: (index: number) => void;
};

export const ProfileCenter = forwardRef<Ref, ProfileCenterProps>((props, ref) => {
    const router = useRouter();
    const { dismiss } = useBottomSheetModal();
    const { switchSession, logOut } = useAuth();
    const subModalRef = useRef<BottomSheetModal>(null);
    const modalIndex = useSharedValue(-1);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [block, setBlock] = useState(false);

    // Mock data des utilisateurs
    const users = [
        new User({ id: '1', givenName: 'John', familyName: 'Doe', emailVerified: true, username: 'johndoe', email: '' }),
        new User({ id: '2', givenName: 'Jane', familyName: 'Doe', emailVerified: true, username: 'janedoe', email: '' }),
        new User({ id: '3', givenName: 'Alice', familyName: 'Smith', emailVerified: true, username: 'alicesmith', email: '' }),
        new User({ id: '4', givenName: 'Bob', familyName: 'Smith', emailVerified: true, username: 'bobsmith', email: '' }),
    ];

    const handleMenuClicked = useCallback(() => {
        subModalRef.current?.present();
        setBlock(true);
    }, []);

    const handleAnimateModal = useCallback((fromIndex: number, toIndex: number) => {
        if (block && toIndex === -1) {
            setBlock(false);
            return;
        }
        modalIndex.value = toIndex;
    }, []);

    const handleAddAccount = () => console.log('Add account');
    const handleAccountsCenter = () => {
        dismiss();
        router.push('/settings' as Href<"settings">);
    };

    return (
        <>
            <OpacityBackgroundBottomSheet modalIndex={modalIndex} />
            <CustomBottomSheet ref={ref} onAnimate={handleAnimateModal} {...props}>
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
            <CustomBottomSheet ref={subModalRef}>
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
