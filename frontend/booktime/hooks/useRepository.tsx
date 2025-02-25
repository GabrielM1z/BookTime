import { useState, useEffect, useCallback } from "react";

export const useRepository = <T extends () => Promise<any>>(
    func: T,
    defaultValue: Awaited<ReturnType<T>> = null as any,
    deps: React.DependencyList = []
) => {
    type R = Awaited<ReturnType<T>>;

    const [data, setData] = useState<R>(defaultValue);
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await func();
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, loading, refresh: fetchData };
};
