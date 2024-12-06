import { Platform } from "react-native";
import { ActionRepositoryProps, ActionLibraryRepository } from "../action";

export const actionRepositoryFactory = (): ActionRepositoryProps => {
    return new ActionLibraryRepository();
}
