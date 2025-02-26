import { UserControllerProps } from "@/controllers/UserController";
import { userControllerFactory } from "@/controllers/factories/userControllerFactory";
import { ContextNotFound } from "@/errors/ContextNotFound";
import { User } from "@/models";
import React, { createContext, useState } from "react";

export interface UserProviderProps {
    children: React.ReactNode;
}

// interface UserContextProps {
//     userController: UserControllerProps;
//     user: User | null;
// }

const UserContext = createContext<UserControllerProps | undefined>(undefined);

export const UserProvider = ({
    children,
}: UserProviderProps) => {
    const userController = userControllerFactory();

    // const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={userController}>
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
