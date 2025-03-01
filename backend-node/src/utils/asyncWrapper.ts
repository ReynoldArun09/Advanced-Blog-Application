import { RequestHandler } from "express";

export const AsyncWrapper =
  (fn: CallableFunction): RequestHandler =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
