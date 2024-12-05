import { ApiContext } from "@/providers/api";
import { Api } from "@/services/api";
import { useContext } from "react";

export const useApi = (): Api => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within a ApiProvider');
    }
    return context;
}
