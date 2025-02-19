import { useAuthContext } from "@/contexts/AuthContext";
import { useController } from "@/hooks/useController";
import { User } from "@/models/User";
import { BottomSheetFlatList, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { CustomBottomSheet } from "../CustomBottomSheet";
import { CustomBottomSheetProps } from "../CustomBottomSheet/CustomBottomSheet";
import { ProfileItem } from "./ProfileItem";
import { styles } from "./styles";
import { useFadeTransition } from "@/contexts/FadeTransitionContext";


export interface AccountCenterProps extends Omit<CustomBottomSheetProps, "children"> {
    header?: React.ReactNode;
    footer?: React.ComponentType<any> | React.ReactElement;
    selectCurrentUser?: boolean;
    filter?: (user: User) => boolean;
}


export const AccountCenter = forwardRef<BottomSheetModal, AccountCenterProps>(
    ({ header, footer, selectCurrentUser = false, filter, ...bottomSheetProps }, ref) => {
        const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
        const [users, setUsers] = useState<User[]>([]);
        
        const { dismissAll } = useBottomSheetModal();
        const { userController } = useController();
        const { switchSession, session, sessions } = useAuthContext();
        const { withFadeTransition } = useFadeTransition();

        const fetchSessions = async () => {
            const usersData = await userController.getAllBySession(sessions);
            setUsers(filter ? usersData.filter(filter) : usersData);
        };

        useEffect(() => {
            fetchSessions();
        }, []);

        useEffect(() => {
            setSelectedUserId(session?.id_user || null);
        }, [session]);

        const handleItemClicked = useCallback((id: string) => {
            dismissAll();
            const session = sessions.find((session) => session.id_user == id);
            if (session) {
                withFadeTransition(() => switchSession(session), 200);
            }
        }, [sessions, switchSession]);

        return (
            <CustomBottomSheet ref={ref} {...bottomSheetProps}>
                {header}
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
                    ListFooterComponent={footer}
                    contentContainerStyle={styles.profileContainer} // FIXME: dont know why this is needed, already defined in BottomSheetView
                />
            </CustomBottomSheet>
        );
    });
