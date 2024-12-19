import { Platform } from "react-native";
import { BookRepositoryProps, APIBookRepository, SQLiteBookRepository } from "../BookRepository";

export const bookRepositoryFactory = (): BookRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIBookRepository();
    }
    return new SQLiteBookRepository();
}