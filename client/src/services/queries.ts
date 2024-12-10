import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { FetchBlogsApi, RecentBlogsApi } from "./api";

export const useFetchBlogsQuery = () => {
    return useInfiniteQuery({
        queryKey: ["blogs"],
        queryFn: ({ pageParam = 1 }) => FetchBlogsApi(pageParam),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
        initialPageParam: 1
    });
};

export const useRecentBlogsQuery = () => {
    return useQuery({
        queryKey: ["recent-blogs"],
        queryFn: () => RecentBlogsApi(),
    })
};
