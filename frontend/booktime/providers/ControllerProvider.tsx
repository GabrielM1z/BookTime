import { SessionController } from "@/controllers/SessionController";
import { UserController } from "@/controllers/UserController";
import { SQLiteProviderProps } from "expo-sqlite";
import React, { createContext } from "react";
import { RepositoryProvider } from "./RepositoryProvider";

export interface ControllerContextProps {
    userController: UserController;
}

export const ControllerContext = createContext<ControllerContextProps | undefined>(undefined);

export const ControllerProviderInner = ({ children }: { children: React.ReactNode }) => {
    const userController = new UserController();

    return (
        <ControllerContext.Provider value={{
            userController
        }}>
            {children}
        </ControllerContext.Provider>
    );
}

export const ControllerProvider = ({ children, ...props }: SQLiteProviderProps) => {
    return (
        <RepositoryProvider {...props}>
            <ControllerProviderInner>
                {children}
            </ControllerProviderInner>
        </RepositoryProvider>
    );
}
