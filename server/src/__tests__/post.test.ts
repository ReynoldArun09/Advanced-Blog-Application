import request from 'supertest'
import app from '../app'
import { Comment, Post, User } from '../models'
import jwt from 'jsonwebtoken'
import { ApiErrorMessages, ApiSuccessMessages } from '../constants'

jest.mock('../models/post-model')
jest.mock('../models/user-model')
jest.mock('../models/comment-model')
jest.mock('jsonwebtoken')

describe("Post controller testing", () => {
    beforeAll(() => {
        jest.clearAllMocks()
    })
    describe('create post', () => {
         const mockUserId = "userId123";
        const mockUser = {
            id: mockUserId,
            email: "mockuser@example.com",
            password: "mockpassword123456A$",
            username: "mockusername"
        };
        const mockSelect = jest.fn().mockRejectedValue(mockUser);
        beforeEach(() => {
            jest.clearAllMocks();

            (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });
            (User.findById as jest.Mock).mockResolvedValueOnce({select: mockSelect});
        })
        it('should create post and return 201 status', async () => {
            (Post.findOne as jest.Mock).mockResolvedValueOnce(null);
            (Post.create as jest.Mock).mockResolvedValueOnce({});
            const response = await request(app).post("/api/v1/posts/create-post").send({
                title: "mocktitle",
                desc: "mockdesc",
                username: "mockusername",
                categories: "mockcategories",
            }).set("Cookie", [`accessToken=mocktoken`])

            expect(response.status).toBe(201)
            expect(response.body.success).toBeTruthy()
            expect(response.body.message).toBe(ApiSuccessMessages.POST_CREATED)
        });
          it('should 400 status if post already exist', async () => {
            (Post.findOne as jest.Mock).mockResolvedValueOnce({});
            (Post.create as jest.Mock).mockResolvedValueOnce({});
            const response = await request(app).post("/api/v1/posts/create-post").send({
                title: "mocktitle",
                desc: "mockdesc",
                username: "mockusername",
                categories: "mockcategories",
            }).set("Cookie", [`accessToken=mocktoken`])

            expect(response.status).toBe(400)
            expect(response.body.message).toBe(ApiErrorMessages.POST_ALREADY_EXISTS)
        })
    })

    describe('Get Single Post', () => {
        it('should get single post and return 200 status', async () => {
            (Post.findById as jest.Mock).mockResolvedValueOnce({});
            const response = await request(app).get("/api/v1/posts/single-post/1")
            expect(response.status).toBe(200)
            expect(response.body.success).toBeTruthy()
            expect(response.body.data).toBeInstanceOf(Object)
        });
       it('should 400 status if post does not exist', async () => {
            (Post.findById as jest.Mock).mockResolvedValueOnce(null);
            const response = await request(app).get("/api/v1/posts/single-post/1")
            expect(response.status).toBe(400)
            expect(response.body.message).toBe(ApiErrorMessages.POST_NOT_FOUND)
        });
    })

    describe('Delete Post', () => {
      it('should 400 status if post does not exist', async () => {
            (Post.findById as jest.Mock).mockResolvedValueOnce(null);
            const response = await request(app).delete("/api/v1/posts/delete-post/1")
            expect(response.status).toBe(400)
            expect(response.body.message).toBe(ApiErrorMessages.POST_NOT_FOUND)
        });

        it('should delete post and return 200 status', async () => {
            (Post.findById as jest.Mock).mockResolvedValueOnce({});
            (Post.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({});
            (Comment.deleteMany as jest.Mock).mockResolvedValueOnce({});
            const response = await request(app).delete("/api/v1/posts/delete-post/1")
            expect(response.status).toBe(200)
            expect(response.body.success).toBeTruthy()
            expect(response.body.message).toBe(ApiSuccessMessages.POST_DELETED)
        });
    })
})
