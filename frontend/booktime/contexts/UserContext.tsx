import { UserControllerProps } from "@/controllers/UserController";
import { userControllerFactory } from "@/controllers/factories/userControllerFactory";
import { ContextNotFound } from "@/errors/ContextNotFound";
import { usePersistentState } from "@/hooks/usePersistantState";
// import { User } from "@/models";
import React, { createContext } from "react";

export interface UserProviderProps {
    children: React.ReactNode;
}

interface UserContextProps {
    userController: UserControllerProps;
    lastSync: string | null;
    setLastSync: (lastSync: string | null) => void;
    // user: User | null;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({
    children,
}: UserProviderProps) => {
    const [lastSync, setLastSync] = usePersistentState<string | null>('user_lastSync', null);
    const userController = userControllerFactory();

    // const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ userController, lastSync, setLastSync }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new ContextNotFound("useUserContext", "UserProvider");
    }
    return context;
}
