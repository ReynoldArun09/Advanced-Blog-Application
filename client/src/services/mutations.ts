import { useMutation } from "@tanstack/react-query";
import { CreatePostApi, SignInUserApi, SignUpUserApi } from "./api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export function useCreatePostMutation() {
    return useMutation({
        mutationKey: ['create-post'],
        mutationFn: CreatePostApi
    })
}

export function useSignInUserMutation() {
    return useMutation({
        mutationKey: ['sign-in-user'],
        mutationFn: SignInUserApi,
        onSuccess: (data) => {
            toast.success(data.message)
        }
    })
}

export function useSignUpUserMutation() {
    const navigate = useNavigate()
    return useMutation({
        mutationKey: ['sign-up-user'],
        mutationFn: SignUpUserApi,
        onSuccess: async(data) => {
            await navigate('/signin')
            toast.success(data.message)
        }
    })
}
