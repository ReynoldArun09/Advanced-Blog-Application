import { PostSchemaType } from "@/schemas/post-schema"
import axios, { AxiosError } from "./axios"
import { SignInSchemaType, SignUpSchemaType } from "@/schemas/auth-schema"


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
