import { BottomSheetModal, TouchableScale, useParams } from '@/common';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserContext } from '@/contexts/UserContext';
import { useRepository } from '@/hooks/useRepository';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Divider, IconButton, Text, useTheme } from 'react-native-paper';

const AccountCenterModal = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{ showGuest: string, addAccount: string, selectCurrent: string }>();
    const { showGuest, addAccount, selectCurrent } = useMemo(() => ({
        showGuest: params.showGuest === 'true' ?? false,
        addAccount: params.addAccount === 'true' ?? false,
        selectCurrent: params.selectCurrent === 'true' ?? false,
    }), [params]);

    const { userController } = useUserContext();
    const { switchSession, session, sessions } = useAuthContext();
    const { data } = useRepository(() => userController.getAllBySession(sessions), [], [sessions]);
    const users = useMemo(() => (showGuest ? data : data.filter(user => user.id_user !== 'guest')), [data, showGuest]);
    console.log(showGuest, data, users);
    const selectedId = useDeferredValue(session?.id_user || null);
    const [footerHeight, setFooterHeight] = useState(0);

    const handleSwitchUser = useCallback((id: string) => {
        const session = sessions.find((session) => session.id_user == id);
        if (session) {
            switchSession(session);
            router.replace('/(app)' as Href);
        }
    }, []);

    const handleAddAccount = () => {
        router.back();
        router.push("/SignIn");
    };

    return (
        <BottomSheetModal enableDynamicSizing maxDynamicContentSize={300}>
            <BottomSheetFlatList
                data={users}
                keyExtractor={item => item.id_user}
                renderItem={({ item }) => (
                    <Item
                        idUser={item.id_user}
                        image={item.profil_image}
                        text={item.name}
                        isSelected={selectCurrent && item.id_user === selectedId}
                        onPress={handleSwitchUser}
                    />
                )}
                contentContainerStyle={{ paddingBottom: footerHeight }} // FIXME: This is a workaround to avoid the footer to hide the last item
            />
            {addAccount && (
                <View style={styles.footerContainer} onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
                    <Button mode="outlined" onPress={handleAddAccount}>Add Account</Button>
                </View>
            )}
        </BottomSheetModal>
    );
}

interface ItemProps {
    idUser: string;
    image?: string;
    text?: string;
    isSelected: boolean;
    onPress: (idUser: string) => void;
}

const Item = ({ idUser, image, text, isSelected, onPress }: ItemProps) => {
    // const { colors } = useTheme();

    return (
        <TouchableScale style={styles.itemContainer}
            onPress={() => onPress && !isSelected && onPress(idUser)}
            scaleTo={0.98}
            duration={100}
        >
            {image ?
                <Avatar.Image size={50} source={{ uri: image }} /> :
                <Avatar.Icon size={50} icon="account" />}
            <Text variant="titleMedium" style={styles.text}>{text || "Guest"}</Text>
            {isSelected && (
                <IconButton icon="check-circle" />
            )}
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        padding: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
    },
    text: {
        flex: 1,
    },
});

export default AccountCenterModal;
