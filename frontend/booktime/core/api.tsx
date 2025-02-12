// https://medium.com/@davidecarizzoni/react-native-infinite-scroll-with-react-query-3e5ef90f3caa

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';

//debug axios request
// axios.interceptors.request.use(request => {
//     console.log('Starting Request', JSON.stringify(request, null, 2))
//     return request
// })

// axios.interceptors.response.use(response => {
//     console.log("response !!!");
//     console.log('Response:', JSON.stringify(response, null, 2))
//     return response
// })



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
                
        console.log("la requete : ", url)
        const { data } = await axios.get<T[]>(
            url,
            {
                params: {
                    startIndex: pageParam * limit,
                    maxResults: limit,
                    ...filters,
                },
            }
        )
        console.log("la requete renvoie : ", data)

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
            if (lastPage.data != undefined && lastPage.data.length < limit) {
                console.log("no more data")
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

    console.log("data : ", data)

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
