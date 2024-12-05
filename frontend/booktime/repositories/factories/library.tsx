import { Platform } from "react-native";
import { APILibraryRepository, LibraryRepositoryProps, SQLiteLibraryRepository } from "../library";

export const libraryRepositoryFactory = (): LibraryRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APILibraryRepository();
    }
    return new SQLiteLibraryRepository();
}
