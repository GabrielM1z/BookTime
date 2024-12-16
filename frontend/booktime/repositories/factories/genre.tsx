import { Platform } from "react-native";
import { APIGenreRepository, GenreRepositoryProps, SQLiteGenreRepository } from "../genre";


export const genreRepositoryFactory = (): GenreRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIGenreRepository();
    }
    return new SQLiteGenreRepository();
}