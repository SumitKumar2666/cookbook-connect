import { UsersService } from './users.service';
export declare class UsersResolver {
    private usersService;
    constructor(usersService: UsersService);
    me(context: any): Promise<{
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        avatar: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    user(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        avatar: string | null;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    followUser(userId: string, context: any): Promise<boolean>;
    unfollowUser(userId: string, context: any): Promise<boolean>;
}
