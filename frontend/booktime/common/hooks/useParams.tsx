import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

export default function useParams<T>() {
    const params = useLocalSearchParams();
    const parsedParams = useMemo(
        () =>
            Object.keys(params).reduce((acc, key) => {
                let value: any = params[key];

                if (!value) {
                    return acc;
                }
                if (['true', 'false'].includes(value)) {
                    value = value === 'true';
                }

                return { ...acc, [key]: value };
            }, {} as NonNullable<T>),
        [params],
    );

    return parsedParams;
}
