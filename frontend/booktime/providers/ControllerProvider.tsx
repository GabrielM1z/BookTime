import { BookController } from "@/controllers/BookController";
import { SynchronisationController } from "@/controllers/SynchronisationController";
import { UserController } from "@/controllers/UserController";
import { useSQLite } from "@/hooks/useSQLite";
import React, { createContext } from "react";
import { SQLiteProvider, SQLiteProviderProps } from "./SQLiteProvider";


export interface ControllerContextProps {
    userController: UserController;
    bookController: BookController;
    synchronisationController: SynchronisationController;
}

export const ControllerContext = createContext<ControllerContextProps | undefined>(undefined);

export const ControllerProviderInner = ({ children }: { children: React.ReactNode }) => {
    const { db } = useSQLite();

    const userController = new UserController(db);
    const bookController = new BookController(db);
    const synchronisationController = new SynchronisationController(db);

    return (
        <ControllerContext.Provider value={{
            userController,
            bookController,
            synchronisationController,
        }}>
            {children}
        </ControllerContext.Provider>
    );
}

export const ControllerProvider = ({ children, ...props }: SQLiteProviderProps) => {
    return (
        <SQLiteProvider {...props}>
            <ControllerProviderInner>
                {children}
            </ControllerProviderInner>
        </SQLiteProvider>
    );
}
