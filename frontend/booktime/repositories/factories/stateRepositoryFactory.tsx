import { Platform } from "react-native";
import { APIStateRepository, SQLiteStateRepository, StateRepository } from "../StateRepository";


export const stateRepositoryFactory = (): StateRepository => {
    if (Platform.OS === 'web') {
        return new APIStateRepository();
    }
    return new SQLiteStateRepository();
}