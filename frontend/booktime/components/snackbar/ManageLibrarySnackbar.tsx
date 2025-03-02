import React from 'react';
import { Text, Snackbar, Portal, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

class ManageLibrarySnackbarSingleton {
    private static instance: ManageLibrarySnackbarSingleton;
    private showSnackbarCallback: ((library: string, lastAddedIdBook: string) => void) | null = null;

    private constructor() { }

    static getInstance(): ManageLibrarySnackbarSingleton {
        if (!ManageLibrarySnackbarSingleton.instance) {
            ManageLibrarySnackbarSingleton.instance = new ManageLibrarySnackbarSingleton();
        }
        return ManageLibrarySnackbarSingleton.instance;
    }

    setShowSnackbarCallback(callback: (library: string, lastAddedIdBook: string) => void) {
        this.showSnackbarCallback = callback;
    }

    show(library: string, lastAddedIdBook: string) {
        if (this.showSnackbarCallback) {
            this.showSnackbarCallback(library, lastAddedIdBook);
        } else {
            console.warn("Snackbar callback not set.");
        }
    }
}

export const ManageLibrarySnackbar = ManageLibrarySnackbarSingleton.getInstance();

export const ManageLibrarySnackbarComponent = () => {
    const router = useRouter();
    const { colors } = useTheme();
    const [visible, setVisible] = React.useState(false);
    const [library, setLibrary] = React.useState("");
    const [lastAddedIdBook, setLastAddedIdBook] = React.useState("");

    React.useEffect(() => {
        ManageLibrarySnackbar.setShowSnackbarCallback((library, lastAddedIdBook) => {
            setLibrary(library);
            setLastAddedIdBook(lastAddedIdBook);
            setVisible(true);
        });
    }, []);

    return (
        <Snackbar
            style={{ backgroundColor: colors.surface }}
            visible={visible}
            onDismiss={() => setVisible(false)}
            duration={2000}
            action={{
                label: "Change",
                onPress: () => {
                    router.push({ pathname: "/(app)/ManageLibraryModal", params: { idBook: lastAddedIdBook } });
                },
            }}
        >
            <Text
                style={{ color: colors.onSurface }}
            >
                {`Book added to ${library}`}
            </Text>
        </Snackbar>
    );
};
