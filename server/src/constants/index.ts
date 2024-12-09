export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
}

export enum ValidationMessages {
    MONGO_DB_URI_REQUIRED = "MongoDB URI is required",
    ACCESS_TOKEN_SECRET_LENGTH = "Access token secret must be at least 10 characters",
    REFRESH_TOKEN_SECRET_LENGTH = "Refresh token secret must be at least 10 characters",
    CORS_ORIGIN_REQUIRED = "CORS Origin must be provided",
    CLOUDINARY_CLOUD_NAME_REQUIRED = "Cloudinary Cloud Name is required",
    CLOUDINARY_API_KEY_REQUIRED = "Cloudinary API Key is required",
    CLOUDINARY_API_SECRET_REQUIRED = "Cloudinary API Secret is required",

}

export enum GlobalSuccessMessages {
    MONGO_CONNECTION_SUCCESS = "[Mongo]: MongoDB connected successfully",
}
export enum GlobalErrorMessages {
    ENV_PARSE_ERROR = "Error parsing environment variables:",
    MONGO_ENV_NOT_DEFINED = "MONGO_DB_URI environment variable not defined",
    MONGO_CONNECTION_ERROR = "MongoDB connection error: ",
}
