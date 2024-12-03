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
        const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIVWlxX3Ywd2R2a0ozSV9wenc1VGpfSW5iZENmMWl3MTYyYUc3bTFQZHFVIn0.eyJleHAiOjE3MzMxMjU5NjMsImlhdCI6MTczMzEyNTY2MywianRpIjoiOTc2ODlmYWEtMmJkNS00NWJhLWJiYzgtOTBiZjY4ZWViMzAxIiwiaXNzIjoiaHR0cDovLzE1OS4zMS4yNDcuMTMwOjgwODAvcmVhbG1zL2Jvb2t0aW1lIiwiYXVkIjpbImdhdGV3YXktY2xpZW50IiwiYWNjb3VudCJdLCJzdWIiOiIxYTBmMzBkZC1iNGU4LTRmZmYtYmNlNy02YTRjMjkxZGNhNmMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJnYXRld2F5LWNsaWVudCIsInNpZCI6ImFmMmU4Nzc1LWE0YzUtNDgwNS1iNmY3LThjMmNiOWVmNjhkOCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYm9va3RpbWUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoidGVzdCB0ZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdCIsImdpdmVuX25hbWUiOiJ0ZXN0IiwiZmFtaWx5X25hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QifQ.nawXCL7ZEhMVP-8qmVwT1G53Z1YN4vlheALr_m7ZVnoi1r6yorqB_LyzdK-m_BusKtGz2uGDCF1VK9YkF5cXo-HhgI5BzEZMQS_gv_2irIQcUoCAhuAbhSbZtaCgPl7LaIDq_Jq0DswHLPutdrX9PXgPROT8gk1dDcugaiRxID2NKVM1Ix-5LLiPgIJ5f-FplXa7CoKPAbkuR6o_6exfnC7v2k0-lxpSOJSxVO14ijfY4XV5Cyh2DCkzyvCjOirghfBqL0BTJqJp-y4jXUNy1xSFesSjUdV45HgMaLjGNoCGTqYoNiaNxOYg76BebxQKlbCbOmrzQ-14cJzCuNJcLQ" 
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
        )

        // const headers = { 'Authorization': 'Bearer ' +token };
        // const { data } = await fetch(url + "startIndex=0&maxResults=10&query=harry", {
        //     method: "GET",
        //     mode: "no-cors",
        //     headers: headers
        // }).then(function (response) {
        //     console.log(response);
        // }).catch(function (e) {
        //     console.log(e);
        // });

        

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
