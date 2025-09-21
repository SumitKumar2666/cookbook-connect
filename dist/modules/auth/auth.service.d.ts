import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(email: string, password: string): Promise<{
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
    register(userData: any): Promise<{
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
