import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "@/models/User";
import { BottomSheetFlatList, BottomSheetModal, useBottomSheetModal, BottomSheetView, BottomSheetFooterProps, BottomSheetFooter } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { CustomBottomSheet, CustomBottomSheetProps } from "@/common";
import { ProfileItem } from "./ProfileItem";
import { styles } from "./styles";
import { Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { View, FlatList } from "react-native";
import { useUserContext } from "@/contexts/UserContext";

export interface AccountCenterProps extends Omit<CustomBottomSheetProps, "children"> {
    addAccountFooter?: boolean;
    selectCurrentUser?: boolean;
    filter?: (user: User) => boolean;
}


export const AccountCenter = forwardRef<BottomSheetModal, AccountCenterProps>(({
    addAccountFooter = false,
    selectCurrentUser = false,
    filter,
    ...bottomSheetProps
}, ref) => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const { bottom: safeBottomArea } = useSafeAreaInsets();

    const router = useRouter();
    const { dismissAll } = useBottomSheetModal();
    const userController = useUserContext();
    const { switchSession, session, sessions } = useAuthContext();

    const fetchSessions = async () => {
        const usersData = await userController.getAllBySession(sessions);
        setUsers(filter ? usersData.filter(filter) : usersData);
    };

    const handleItemClicked = useCallback((id: string) => {
        const session = sessions.find((session) => session.id_user == id);
        if (session) {
            switchSession(session);
            router.replace('/(app)' as Href);
            dismissAll();
        }
    }, []);

    const handleAddAccount = () => {
        dismissAll();
        router.push("/SignIn");
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        setSelectedUserId(session?.id_user || null);
    }, [session]);

    const footerComponent = (props) => (
        <BottomSheetFooter
            {...props}
        // style={[{
        //     flexDirection: 'row',
        //     justifyContent: 'space-between',
        //     gap: 12,
        //     paddingHorizontal: 24,
        //   }, { paddingBottom: safeBottomArea }]}
        >
            <Button mode="outlined" onPress={handleAddAccount}>Add Account</Button>
        </BottomSheetFooter>
    )

    return (
        <CustomBottomSheet ref={ref} {...bottomSheetProps}>
            
            {/* <View> */}
            <BottomSheetFlatList
                data={users}
                keyExtractor={(item) => item.id_user.toString()}
                renderItem={({ item }) => ProfileItem({
                    id: item.id_user,
                    image: item.profil_image,
                    text: item.name || "Guest",
                    isSelected: selectCurrentUser && item.id_user == selectedUserId,
                    onItemClicked: handleItemClicked,
                })}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.profileContainer}
            />
                <Button mode="outlined" onPress={handleAddAccount} style={styles.footerContainer}>Add Account</Button>
            {/* </View> */}
        </CustomBottomSheet>
    );
});
