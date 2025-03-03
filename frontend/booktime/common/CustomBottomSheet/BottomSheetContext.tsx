import { BottomSheetModalProvider, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalProviderProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModalProvider/types";
import { BottomSheetModalContextType } from "@gorhom/bottom-sheet/src/contexts/modal/external";
import React, { createContext, useContext, useState } from "react";

export interface InternalBackdropContextType {
    bottomSheetStack: string[];
    addBottomSheet: (key: string) => void;
    removeBottomSheet: (key: string) => void;
}

const InternalBackdropContext = createContext<InternalBackdropContextType | undefined>(undefined);

export interface BottomSheetProviderProps extends BottomSheetModalProviderProps { }

export const CustomBottomSheetProvider = ({ children }: BottomSheetProviderProps) => {
    const [bottomSheetStack, setBottomSheetStack] = useState<string[]>([]);

    const addBottomSheet = (key: string) => {
        setBottomSheetStack((prevStack) => [...prevStack, key]);
    };

    const removeBottomSheet = (key: string) => {
        setBottomSheetStack((prevStack) => prevStack.filter((item) => item !== key));
    };
    return (
        <InternalBackdropContext.Provider value={{ bottomSheetStack, addBottomSheet, removeBottomSheet }}>
            <BottomSheetModalProvider>
                {children}
            </BottomSheetModalProvider>
        </InternalBackdropContext.Provider>
    );
};

export const useInternalBackdrop = (): InternalBackdropContextType => {
    const context = useContext(InternalBackdropContext);
    if (!context) {
        throw new Error("useInternalBackdrop must be used within a CustomBottomSheetProvider");
    }
    return context;
};
