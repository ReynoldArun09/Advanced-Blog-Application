import request from "supertest";
import app from "../app";
import { Comment, User } from "../models";
import jwt from "jsonwebtoken";
import { ApiSuccessMessages } from "../constants";

jest.mock("jsonwebtoken");
jest.mock("../models/comment-model");
jest.mock("../models/user-model");

describe("Comment controller testing", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  describe("Get All comments", () => {
    it("should return all comments", async () => {
      (Comment.find as jest.Mock).mockResolvedValueOnce([]);
      const response = await request(app).get("/api/v1/comments/all-comments");
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
});
