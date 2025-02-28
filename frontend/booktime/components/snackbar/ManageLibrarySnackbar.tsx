import { Snackbar } from "react-native-paper";
import React, { useCallback, useState } from "react";

export const useManageLibrarySnackbar = () => {
    const [visible, setVisible] = useState(false);
    const [library, setLibrary] = useState("");

    const show = useCallback((lib: string) => {
        setLibrary(lib);
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        setVisible(false);
    }, []);

    return { visible, library, show, hide };
};

interface ManageLibrarySnackbarProps {
    library: string;
    visible: boolean;
    onDismiss: () => void;
    onPressChange: () => void;
}

export const ManageLibrarySnackbar = ({
    library,
    visible,
    onDismiss,
    onPressChange,
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
