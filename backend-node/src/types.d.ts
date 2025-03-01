export interface ContextType {
  id: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      ctx: ContextType;
    }
  }
}
