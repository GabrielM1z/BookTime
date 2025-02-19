import { RepositoryContext } from "@/providers/RepositoryProvider";
import { useContext, useState, useEffect } from "react";

export function useRepositoryContext() {
    const context = useContext(RepositoryContext);
    if (!context) {
        throw new Error("useRepository must be used within a RepositoryProviderWrapper");
    }
    return context;
}


export const useRepository = <T extends () => Promise<any>>(
    func: T,
    deps?: React.DependencyList
) => {
    type R = Awaited<ReturnType<T>>;

    const [data, setData] = useState<R | null>(null);
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await func();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, deps);

    return { data, error, loading };
};

