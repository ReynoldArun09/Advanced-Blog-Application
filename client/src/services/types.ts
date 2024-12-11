export interface Blogs {
    _id: string,
    title: string,
    desc: string,
    image: string,
    username: string,
    userId: string,
    comments: string[],
    categories: string[],
    createdAt: string,
    updatedAt: string
}

export interface FetchBlogsApiResponse {
    data: Blogs[]
    hasMore: boolean,
    nextPage: number
}


export interface CommentResponse {
 _id: string
 comment: string
 createdAt: string | Date
 updatedAt: string |Date
 userId: string
 username: string
 postId: string
}
