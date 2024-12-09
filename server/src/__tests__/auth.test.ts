import bcrypt  from 'bcryptjs';
import request from 'supertest'
import app from '../app'
import { User } from '../models';
import { ApiErrorMessages, ApiSuccessMessages } from '../constants';
import jwt from 'jsonwebtoken'

jest.mock('../models/user-model')
jest.mock('bcryptjs')
jest.mock("jsonwebtoken")

describe("Auth controller testng", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });
    describe("Sign up user", () => {
        const mockUser = {
            email: "mockuser@example.com",
            password: "mockpassword123456A$",
            username: "mockusername"
        }
        it("should return 400 status code if user already exists", async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
            const response = await request(app).post("/api/v1/auth/signup-user").send(mockUser)
            expect(response.status).toBe(400)
            expect(response.body.message).toBe(ApiErrorMessages.USER_ALREADY_EXISTS)
        })

        it("should Signup user and return 201 status code", async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(null);
            (User.create as jest.Mock).mockResolvedValueOnce(mockUser);
            const response = await request(app).post("/api/v1/auth/signup-user").send(mockUser)

            expect(response.status).toBe(201)
            expect(response.body.message).toBe(ApiSuccessMessages.SINGUP_SUCCESS)
        })
    }),

    describe("Sign in user", () => {
        const mockUser = {
            email: "mockuser@example.com",
            password: "mockpassword123456A$",
            username: "mockusername"
        };

        it('should return 400 status if user doesnt exist in db', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(null);
            const response = await request(app).post("/api/v1/auth/signin-user").send(mockUser)
            expect(response.status).toBe(400)
            expect(response.body.message).toBe(ApiErrorMessages.USER_NOT_FOUND)
        });
        it('should return 400 status if password is dont match', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
            const response = await request(app).post("/api/v1/auth/signin-user").send(mockUser)
            expect(response.status).toBe(400)
            expect(response.body.message).toBe(ApiErrorMessages.INCORRECT_PASSWORD)
        });
        it('should sign in user and return 200 status', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
            const response = await request(app).post("/api/v1/auth/signin-user").send(mockUser)
            expect(response.status).toBe(200)
            expect(response.body.message).toBe(ApiSuccessMessages.SIGNIN_SUCCESS)
        })
    })

    describe("Sign out user", () => {
        it('should sign out user and return 200 status', async () => {
            const response = await request(app).post("/api/v1/auth/signout-user")
            expect(response.status).toBe(200)
            expect(response.body.message).toBe(ApiSuccessMessages.SIGNOUT_SUCCESS)
            expect(response.header['accesstoken']).toBeUndefined()
            expect(response.header['access-token']).toBeUndefined()
        })
    })

    describe('verify user', () => {
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
        it('should verify user and return 200 status', async () => {
            const response = await request(app).get("/api/v1/auth/verify-user").set("Cookie", [`accessToken=mocktoken`])
            expect(response.status).toBe(200)

        })
    })
})
