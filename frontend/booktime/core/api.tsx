// https://medium.com/@davidecarizzoni/react-native-infinite-scroll-with-react-query-3e5ef90f3caa

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';

type Params<F> = {
    key: string;
    url: string;
    limit?: number;
    filters?: F;
    initialPage?: number;
    formatResponse?: (data: any) => any;
};

export const useInfiniteScroll = <T = unknown, F = object>({
    key,
    url,
    limit = 10,
    filters,
    initialPage = 1,
    formatResponse,
}: Params<F>) => {

    //Création de clé unique pour chaques résultats
    const queryKey = [key, ..._.values<string | string[]>(_.omitBy(filters || {}, _.isEmpty))].filter(
        c => Boolean(c) && !_.isEmpty(c),
    );

    const [isRefreshing, setIsRefreshing] = useState(false);

    //récupère les données 
    const queryFn = async ({ pageParam = initialPage }) => {
        //affiche avec des pages
        // const { data } = await axios.get<T[]>(url, {
        //     params: {
        //         page: pageParam,
        //         limit,
        //         ...filters,
        //     },
        // });
        //affiche avec des index (les adaptants en page)
        const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIVWlxX3Ywd2R2a0ozSV9wenc1VGpfSW5iZENmMWl3MTYyYUc3bTFQZHFVIn0.eyJleHAiOjE3MzM0NDAyNTksImlhdCI6MTczMzQwNDI1OSwianRpIjoiNTY1MDA3ZTMtMTJhNi00ZWVlLTg4ZWMtNTBhYjNlMzQ0MTYzIiwiaXNzIjoiaHR0cDovLzE1OS4zMS4yNDcuMTMwOjgwODAvcmVhbG1zL2Jvb2t0aW1lIiwiYXVkIjpbImdhdGV3YXktY2xpZW50IiwiYWNjb3VudCJdLCJzdWIiOiIxYTBmMzBkZC1iNGU4LTRmZmYtYmNlNy02YTRjMjkxZGNhNmMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJnYXRld2F5LWNsaWVudCIsInNpZCI6IjdlZDZlMWEzLWFlMmUtNGJmZC1hNDZiLTM3OTg0NDJkMmM0MiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYm9va3RpbWUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InRlc3QgdGVzdCIsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3QiLCJnaXZlbl9uYW1lIjoidGVzdCIsImZhbWlseV9uYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0In0.iTuCdfNb3v_pvslf-MieM71LgDBh6maQV09Tp3HDqDkM9Phz5UNGh085jAk5eycPLc01aemhhisamTodTAjOKkIdrjbcUxgdUIRncb94wNIaBb_RbycioUcmpYUAuFg751gNab-SCz6XYKfiLQ8idGzelIMxGXi6fBqgxaZc9_Y0UzJMRQMyxzBBE97CJKmsWI_6n0SxBVG7jMkki-ix2KFdpAH4cLy4EOiBxrruWCTmEeoCINvSXRqpVKpM3V-7E7M-MQmWJXifxieJ-2YPHRWNpOM9IpqqNNsy7ggiJCpok6BeNUBzWiYStDVc75RmhANIUFYDe3wBbCNw8lY9lQ"

        try {
            const { data } = await axios.get<T[]>(
                url,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        startIndex: pageParam * limit,
                        maxResults: limit,
                        ...filters,
                    },
                }
            ).catch(function (error) {
                console.log(error);
            })

        } catch (error) {
            console.log(error)
        }

        return {
            data: formatResponse ? formatResponse(data) : data,
            nextPage: pageParam + 1,
        };
    };

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 0,
        // vérifie si il reste des données
        getNextPageParam: (lastPage, __, lastPageParam) => {
            if (lastPage.data.length < limit) {
                return undefined;
            }
            return lastPageParam + 1;
        },
        // vérifie si il reste des données
        getPreviousPageParam: (_, __, firstPageParam) => {
            if (firstPageParam === 1) {
                return undefined;
            }
            return firstPageParam - 1;
        },
    });

    console.log(data)

    //charge la prochaine page
    const loadNext = useCallback(() => {
        hasNextPage && fetchNextPage();
    }, [fetchNextPage, hasNextPage]);

    const onRefresh = useCallback(() => {
        if (!isRefreshing) {
            setIsRefreshing(true);
            refetch()
                .then(() => setIsRefreshing(false))
                .catch(() => setIsRefreshing(false));
        }
    }, [isRefreshing, refetch]);

    //merge les data des différentes pages en une liste
    const flattenData = useMemo(() => {
        return data?.pages.flatMap(page => page.data) || [];
    }, [data?.pages]);

    return {
        data: flattenData,
        onEndReached: loadNext,
        isRefreshing,
        onRefresh,
        isFetchingNextPage
    };
};
