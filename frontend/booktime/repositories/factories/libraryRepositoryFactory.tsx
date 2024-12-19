import { Platform } from "react-native";
import { APILibraryRepository, LibraryRepository, SQLiteLibraryRepository } from "../LibraryRepository";

export const libraryRepositoryFactory = (): LibraryRepository => {
    if (Platform.OS === 'web') {
        return new APILibraryRepository();
    }
    return new SQLiteLibraryRepository();
}
