import { useSQLiteContext } from "expo-sqlite";
import { Platform } from "react-native";
import { BookControllerProps, LocalBookController, RemoteBookController } from "../BookController";

export function bookControllerFactory(id_user: string): BookControllerProps {
    if (Platform.OS === "web") {
        return new RemoteBookController(id_user);
    }

    const db = useSQLiteContext();
    return new LocalBookController(db, id_user);
}
