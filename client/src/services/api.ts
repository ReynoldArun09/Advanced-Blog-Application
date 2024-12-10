import { PostSchemaType } from "@/schemas/post-schema"
import axios, { AxiosError } from "./axios"


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
