import { RepositoryContext } from "@/providers/repository";
import { useContext } from "react";

export function useRepository() {
    const context = useContext(RepositoryContext);
    if (!context) {
        throw new Error("useRepository must be used within a RepositoryProviderWrapper");
    }
    return context;
}
