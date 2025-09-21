export declare class User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateUserInput {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    bio?: string;
}
export declare class LoginInput {
    email: string;
    password: string;
}
export declare class AuthPayload {
    access_token: string;
    user: User;
}
