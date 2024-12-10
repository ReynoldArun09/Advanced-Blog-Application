import { useMutation } from "@tanstack/react-query";
import { CreatePostApi, LoginUserApi, RegisterUserApi } from "./api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export function useCreatePostMutation() {
    return useMutation({
        mutationKey: ['create-post'],
        mutationFn: CreatePostApi
    })
}

export function useLoginUserMutation() {
    return useMutation({
        mutationKey: ['login-user'],
        mutationFn: LoginUserApi,
        onSuccess: (data) => {
            toast.success(data.message)
        }
    })
}

export function useRegisterUserMutation() {
    const navigate = useNavigate()
    return useMutation({
        mutationKey: ['register-user'],
        mutationFn: RegisterUserApi,
        onSuccess: async(data) => {
            await navigate('/login')
            toast.success(data.message)
        }
    })
}
