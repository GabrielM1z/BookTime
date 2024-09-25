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
    const queryKey = [key, ..._.values<string | string[]>(_.omitBy(filters || {}, _.isEmpty))].filter(
        c => Boolean(c) && !_.isEmpty(c),
    );

    const [isRefreshing, setIsRefreshing] = useState(false);

    const queryFn = async ({ pageParam = initialPage }) => {
        // const { data } = await axios.get<T[]>(url, {
        //     params: {
        //         page: pageParam,
        //         limit,
        //         ...filters,
        //     },
        // });
        const { data } = await axios.get<T[]>(url, {
            params: {
                startIndex: pageParam * limit,
                maxResults: limit,
                ...filters,
            },
        });
        
        return {
            data: formatResponse ? formatResponse(data) : data,
            nextPage: pageParam + 1,
        };
    };

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage, __, lastPageParam) => {
            if (lastPage.data.length < limit) {
                return undefined;
            }
            return lastPageParam + 1;
        },
        getPreviousPageParam: (_, __, firstPageParam) => {
            if (firstPageParam === 1) {
                return undefined;
            }
            return firstPageParam - 1;
        },
    });

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

    const flattenData = useMemo(() => {
        return data?.pages.flatMap(page => page.data) || [];
    }, [data?.pages]);

    console.log("flattenData");

    return {
        data: flattenData,
        onEndReached: loadNext,
        isRefreshing,
        onRefresh,
        isFetchingNextPage
    };
};
