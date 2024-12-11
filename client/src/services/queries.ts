import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { FetchBlogsApi, GetCommentsApi, RecentBlogsApi, SinglePostApi } from "./api";

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

export const useSinglePostQuery = (id:string) => {
    return useQuery({
        queryKey: ['single-post'],
        queryFn: () => SinglePostApi(id)
    })
}

export const useCommentsQuery = (id:string) => {
    return useQuery({
        queryKey: ['comments'],
        queryFn: () => GetCommentsApi(id)
    })
}
