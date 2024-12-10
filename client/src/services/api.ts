import { PostSchemaType } from "@/schemas/post-schema"
import axios, { AxiosError } from "./axios"
import { SignInSchemaType, SignUpSchemaType } from "@/schemas/auth-schema"
import { Blogs, FetchBlogsApiResponse } from "./types"


export const CreatePostApi = async(values: PostSchemaType) => {
   try {
    const response = await axios.post('/posts/create-post', values)
    return response.data
   } catch (error) {
        if(error instanceof AxiosError) {
            throw new Error(error.response?.data.message)
        }
        throw error
   }

}
export const SignInUserApi = async(values: SignInSchemaType) => {
    try {
     const response = await axios.post('/auth/signin-user', values)
     return response.data
    } catch (error) {
         if(error instanceof AxiosError) {
             throw new Error(error.response?.data.message)
         }
         throw error
    }

 }

 export const SignUpUserApi = async(values: SignUpSchemaType) => {
    try {
     const response = await axios.post('/auth/signup-user', values)
     return response.data
    } catch (error) {
         if(error instanceof AxiosError) {
             throw new Error(error.response?.data.message)
         }
         throw error
    }

 }


 export const SignOutUserApi = async() => {
    try {
     const response = await axios.post('/auth/signout-user')
     return response.data
    } catch (error) {
         if(error instanceof AxiosError) {
             throw new Error(error.response?.data.message)
         }
         throw error
    }

 }


 export const FetchBlogsApi = async(pageParams: number = 1): Promise<FetchBlogsApiResponse> => {
    try {
        const response = await axios.get("/posts/all-posts", {
            params: {page: pageParams, limit: 4}
        })
        return response.data
    } catch (error) {
        if(error instanceof AxiosError) {
            throw new Error(error.response?.data.message ?? "Something went wrong")
        }
        throw error
    }
}

export const RecentBlogsApi = async(): Promise<Blogs[]> => {
    try {
        const response = await axios.get("/posts/recent-posts")
        return response.data.data
    } catch (error) {
        if(error instanceof AxiosError) {
            throw new Error(error.response?.data.message ?? "Something went wrong")
        }
        throw error
    }
}
