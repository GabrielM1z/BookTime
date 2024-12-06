import { Platform } from "react-native";
import { ActionRepositoryProps, SQLiteLibraryRepository } from "../action";

export const actionRepositoryFactory = (): ActionRepositoryProps => {
    return new SQLiteLibraryRepository();
}
