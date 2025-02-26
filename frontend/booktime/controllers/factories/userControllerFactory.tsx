import { useSQLiteContext } from "expo-sqlite";
import { Platform } from "react-native";
import { LocalUserController, RemoteUserController, UserControllerProps } from "../UserController";

export function userControllerFactory(): UserControllerProps {
    if (Platform.OS === "web") {
        return new RemoteUserController();
    }

    const db = useSQLiteContext();
    return new LocalUserController(db);
}
