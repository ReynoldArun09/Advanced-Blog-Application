import { useMutation } from "@tanstack/react-query";
import { CreatePostApi } from "./api";


export function useCreatePostMutation() {
    return useMutation({
        mutationKey: ['create-post'],
        mutationFn: CreatePostApi
    })
}
