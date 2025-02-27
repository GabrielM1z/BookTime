import { Portal, Snackbar } from "react-native-paper";
import React from "react";

export interface ManageLibrarySnackbarProps {
    library: string;
    visible: boolean;
    onDismiss: () => void;
    onPressChange: () => void;
}

export const ManageLibrarySnackbar = ({ 
    library,
    visible,
    onDismiss, 
    onPressChange 
}: ManageLibrarySnackbarProps) => (
    <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000}
        action={{
            label: "Change",
            onPress: onPressChange,
        }}
    >
        Book added to "{library}"
    </Snackbar>
);
