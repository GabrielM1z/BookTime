import { Platform } from "react-native";
import { APIFormatRepository, FormatRepository, SQLiteFormatRepository } from "../FormatRepository";


export const formatRepositoryFactory = (): FormatRepository => {
    if (Platform.OS === 'web') {
        return new APIFormatRepository();
    }
    return new SQLiteFormatRepository();
}