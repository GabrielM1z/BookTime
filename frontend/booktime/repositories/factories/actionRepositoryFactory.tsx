import { Platform } from "react-native";
import { ActionRepositoryProps, ActionRepository } from "../ActionRepository";

export const actionRepositoryFactory = (): ActionRepositoryProps => {
    return new ActionRepository();
}
