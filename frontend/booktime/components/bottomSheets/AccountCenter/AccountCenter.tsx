import { useAuthContext } from "@/hooks/useAuth";
import { useController } from "@/hooks/useController";
import { User } from "@/models/User";
import { BottomSheetFlatList, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { CustomBottomSheet } from "../CustomBottomSheet";
import { CustomBottomSheetProps } from "../CustomBottomSheet/CustomBottomSheet";
import { ProfileItem } from "./ProfileItem";


export interface AccountCenterProps extends Omit<CustomBottomSheetProps, "children"> {
    footer?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;

    selectCurrentUser?: boolean;
}


export const AccountCenter = forwardRef<BottomSheetModal, AccountCenterProps>(
    ({ footer, selectCurrentUser = false, ...bottomSheetProps }, ref) => {
        const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
        const [users, setUsers] = useState<User[]>([]);

        const { dismissAll } = useBottomSheetModal();
        const { userController } = useController();
        const { switchSession, session, sessions } = useAuthContext();

        const fetchSessions = async () => {
            const usersData = await userController.getAllBySession(sessions);
            console.log(usersData);
            setUsers(usersData);
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
                switchSession(session);
            }
        }, [sessions, switchSession]);

        return (
            <CustomBottomSheet ref={ref} {...bottomSheetProps}>
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
                />
            </CustomBottomSheet>
        );
    });
