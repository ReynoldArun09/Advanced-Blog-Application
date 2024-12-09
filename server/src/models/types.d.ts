export interface IUser extends Document {
    username: string,
    email: string
    password: string,
    avatar: string
}

export interface IPost extends Document {
    title: string,
    desc: string,
    image: string,
    username: string
    userId: string
    comments: ObjectId[]
    categories: string[]
}

export interface IComment extends Document {
    comment: string,
    username: string,
    postId: string,
    userId: string
}
