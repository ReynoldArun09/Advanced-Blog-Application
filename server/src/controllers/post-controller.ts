import { type Request, type Response } from 'express'
import { AppError, AsyncWrapper } from '../utils'
import { ApiErrorMessages, ApiSuccessMessages, HttpStatusCode } from '../constants'
import { Post, Comment } from '../models';
import { cloudinary } from '../lib';
import { PostSchemaType } from '../schemas/post-schema';


export const GetAllBlogPostApi = AsyncWrapper(async (req: Request, res: Response) => {
    const {page = 1, limit = 5} = req.query
    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const skip = (pageNum - 1) * limitNum


    const posts = await Post.find({}).sort({createdAt: -1}).skip(skip).limit(limitNum)
    const totalPost = await Post.countDocuments({})
    const hasMore = pageNum * limitNum < totalPost

    res.status(HttpStatusCode.OK).json({
        data: posts,
        hasMore,
        nextPage: hasMore ? pageNum + 1 : null
    })

})

export const GetRecentBlogPostApi = AsyncWrapper(async (req: Request, res: Response) => {
    const posts = await Post.find({}).sort({createdAt: -1}).limit(4)

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: posts,
    })

})


export const CreatePostApi = AsyncWrapper(async (req: Request, res: Response) => {
    const {title, desc, username, categories, image} = req.body as PostSchemaType
    const userId = req.user._id
    const existingPost = await Post.findOne({ title })

    if (existingPost) {
        throw new AppError(ApiErrorMessages.POST_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST)
    }
    let imageUrl;
    if(image) {
        const response = await cloudinary.uploader.upload(image, {
            folder: 'blog-application',
        })
        imageUrl = response.secure.url
    }

    await Post.create({
        title, desc, username, userId, categories, image: imageUrl
    })

    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ApiSuccessMessages.POST_CREATED
    })

})

export const SinglePostApi = AsyncWrapper(async (req: Request, res: Response) => {
    const postId = req.params.id

    const existingPost = await Post.findById(postId)

    if (!existingPost) {
        throw new AppError(ApiErrorMessages.POST_NOT_FOUND, HttpStatusCode.BAD_REQUEST)
    }

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: existingPost
    })

})

export const DeletePostApi = AsyncWrapper(async (req: Request, res: Response) => {
    const postId = req.params.id

    const existingPost = await Post.findById(postId)

    if (!existingPost) {
        throw new AppError(ApiErrorMessages.POST_NOT_FOUND, HttpStatusCode.BAD_REQUEST)
    }

    if(existingPost.image) {
        const imageId = existingPost.image.split('/').pop()?.split('.')[0]
        if(imageId) {
            await cloudinary.uploader.destroy(imageId)        }
    }

   const result = await Promise.all([
        Post.findByIdAndDelete(postId),
        Comment.deleteMany({ postId })
   ])

   if(!result[0]) {
        throw new AppError(ApiErrorMessages.FAILED_TO_DELETE, HttpStatusCode.BAD_REQUEST)
   }

    res.status(HttpStatusCode.OK).json({
        success: true,
        message: ApiSuccessMessages.POST_DELETED
    })

})

export const SearchPostApi = AsyncWrapper(async (req: Request, res: Response) => {
    const search = req.params.searchTerm
    const regex = new RegExp(search, 'i')

    const findPosts = await Post.find({ title: { $regex: regex } })

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: findPosts
    })

})
