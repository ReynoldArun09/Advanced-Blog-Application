import { type Request, type Response } from 'express'
import { AsyncWrapper } from '../utils'
import { Comment, Post } from '../models'
import { ApiSuccessMessages, HttpStatusCode } from '../constants'


export const GetAllCommentApi = AsyncWrapper(async (req: Request, res: Response) => {
    const postId = req.params.postId

    const comments = await Comment.find({postId})

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: comments
    })
})


export const CreateCommentApi = AsyncWrapper(async (req: Request, res: Response) => {
    const {comment, postId, username} = req.body
    const userId = req.user?._id

    const newComment = await Comment.create({
        comment, postId, username, userId
    })

    await Post.findByIdAndUpdate(postId, {
        $push: {
            comments: newComment._id
        }
    })

    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ApiSuccessMessages.COMMENT_CREATED
    })

})
export const DeleteCommentApi = AsyncWrapper(async (req: Request, res: Response) => {
    const {postId, commentId} = req.params

    await Post.findByIdAndUpdate(postId, {
        $pull: {
            comments: commentId
        }
    })

    await Comment.findByIdAndDelete(commentId)

    res.status(HttpStatusCode.OK).json({
        success: true,
        message: ApiSuccessMessages.COMMENT_DELETED
    })
})
