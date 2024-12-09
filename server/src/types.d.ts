
export interface JwtType {
    _id: ObjectId;
    email: string;
    username: string
}


declare global {
    namespace Express {
        interface Request {
            user: JwtType
        }
    }
}
