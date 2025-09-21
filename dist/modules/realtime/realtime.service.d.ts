import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    private jwtService;
    server: Server;
    private redisClient;
    private redisSubscriber;
    constructor(configService: ConfigService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    joinRecipe(client: Socket, recipeId: string): Promise<void>;
    leaveRecipe(client: Socket, recipeId: string): Promise<void>;
    notifyNewRating(recipeId: string, rating: any): Promise<void>;
    notifyNewComment(recipeId: string, comment: any): Promise<void>;
    notifyNewRecipe(recipe: any, authorId: string): Promise<void>;
    updateUserFollowers(userId: string, followerId: string, isFollowing: boolean): Promise<void>;
    private setupRedisSubscriptions;
    private handleRecipeUpdate;
    private handleUserUpdate;
}
export declare class RealtimeService {
    private realtimeGateway;
    constructor(realtimeGateway: RealtimeGateway);
    notifyNewRating(recipeId: string, rating: any): Promise<void>;
    notifyNewComment(recipeId: string, comment: any): Promise<void>;
    notifyNewRecipe(recipe: any, authorId: string): Promise<void>;
    updateUserFollowers(userId: string, followerId: string, isFollowing: boolean): Promise<void>;
}
