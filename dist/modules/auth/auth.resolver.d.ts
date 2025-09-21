import { AuthService } from './auth.service';
import { CreateUserInput, LoginInput } from '../users/dto/user.dto';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    login(input: LoginInput): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    register(input: CreateUserInput): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
