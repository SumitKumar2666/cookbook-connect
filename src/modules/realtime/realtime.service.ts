import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private redisClient: Redis;
  private redisSubscriber: Redis;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.redisClient = new Redis(this.configService.getOrThrow<string>('REDIS_URL'));
    this.redisSubscriber = new Redis(this.configService.getOrThrow<string>('REDIS_URL'));
    this.setupRedisSubscriptions();
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      
      // Join user-specific room
      client.join(`user:${payload.sub}`);
      
      console.log(`User ${payload.sub} connected`);
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`User ${client.data.userId} disconnected`);
  }

  @SubscribeMessage('join_recipe')
  async joinRecipe(client: Socket, recipeId: string) {
    client.join(`recipe:${recipeId}`);
  }

  @SubscribeMessage('leave_recipe')
  async leaveRecipe(client: Socket, recipeId: string) {
    client.leave(`recipe:${recipeId}`);
  }

  async notifyNewRating(recipeId: string, rating: any) {
    const notification = {
      type: 'NEW_RATING',
      recipeId,
      rating,
      timestamp: new Date(),
    };

    // Publish to Redis for horizontal scaling
    await this.redisClient.publish('recipe_updates', JSON.stringify(notification));
    
    // Emit to connected clients
    this.server.to(`recipe:${recipeId}`).emit('new_rating', notification);
  }

  async notifyNewComment(recipeId: string, comment: any) {
    const notification = {
      type: 'NEW_COMMENT',
      recipeId,
      comment,
      timestamp: new Date(),
    };

    await this.redisClient.publish('recipe_updates', JSON.stringify(notification));
    this.server.to(`recipe:${recipeId}`).emit('new_comment', notification);
  }

  async notifyNewRecipe(recipe: any, authorId: string) {
    // Get followers of the recipe author
    const followersKey = `followers:${authorId}`;
    const followers = await this.redisClient.smembers(followersKey);

    const notification = {
      type: 'NEW_RECIPE',
      recipe,
      authorId,
      timestamp: new Date(),
    };

    await this.redisClient.publish('user_updates', JSON.stringify(notification));

    // Notify all followers
    followers.forEach(followerId => {
      this.server.to(`user:${followerId}`).emit('new_recipe', notification);
    });
  }

  async updateUserFollowers(userId: string, followerId: string, isFollowing: boolean) {
    const followersKey = `followers:${userId}`;
    
    if (isFollowing) {
      await this.redisClient.sadd(followersKey, followerId);
    } else {
      await this.redisClient.srem(followersKey, followerId);
    }
  }

  private setupRedisSubscriptions() {
    this.redisSubscriber.subscribe('recipe_updates', 'user_updates');
    
    this.redisSubscriber.on('message', (channel, message) => {
      const data = JSON.parse(message);
      
      switch (channel) {
        case 'recipe_updates':
          this.handleRecipeUpdate(data);
          break;
        case 'user_updates':
          this.handleUserUpdate(data);
          break;
      }
    });
  }

  private handleRecipeUpdate(data: any) {
    switch (data.type) {
      case 'NEW_RATING':
        this.server.to(`recipe:${data.recipeId}`).emit('new_rating', data);
        break;
      case 'NEW_COMMENT':
        this.server.to(`recipe:${data.recipeId}`).emit('new_comment', data);
        break;
    }
  }

  private handleUserUpdate(data: any) {
    if (data.type === 'NEW_RECIPE') {
      // This is handled in notifyNewRecipe method
    }
  }
}

@Injectable()
export class RealtimeService {
  constructor(private realtimeGateway: RealtimeGateway) {}

  async notifyNewRating(recipeId: string, rating: any) {
    return this.realtimeGateway.notifyNewRating(recipeId, rating);
  }

  async notifyNewComment(recipeId: string, comment: any) {
    return this.realtimeGateway.notifyNewComment(recipeId, comment);
  }

  async notifyNewRecipe(recipe: any, authorId: string) {
    return this.realtimeGateway.notifyNewRecipe(recipe, authorId);
  }

  async updateUserFollowers(userId: string, followerId: string, isFollowing: boolean) {
    return this.realtimeGateway.updateUserFollowers(userId, followerId, isFollowing);
  }
}