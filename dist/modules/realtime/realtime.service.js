"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = exports.RealtimeGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let RealtimeGateway = class RealtimeGateway {
    configService;
    jwtService;
    server;
    redisClient;
    redisSubscriber;
    constructor(configService, jwtService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.redisClient = new ioredis_1.default(this.configService.getOrThrow('REDIS_URL'));
        this.redisSubscriber = new ioredis_1.default(this.configService.getOrThrow('REDIS_URL'));
        this.setupRedisSubscriptions();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            const payload = this.jwtService.verify(token);
            client.data.userId = payload.sub;
            client.join(`user:${payload.sub}`);
            console.log(`User ${payload.sub} connected`);
        }
        catch (error) {
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        console.log(`User ${client.data.userId} disconnected`);
    }
    async joinRecipe(client, recipeId) {
        client.join(`recipe:${recipeId}`);
    }
    async leaveRecipe(client, recipeId) {
        client.leave(`recipe:${recipeId}`);
    }
    async notifyNewRating(recipeId, rating) {
        const notification = {
            type: 'NEW_RATING',
            recipeId,
            rating,
            timestamp: new Date(),
        };
        await this.redisClient.publish('recipe_updates', JSON.stringify(notification));
        this.server.to(`recipe:${recipeId}`).emit('new_rating', notification);
    }
    async notifyNewComment(recipeId, comment) {
        const notification = {
            type: 'NEW_COMMENT',
            recipeId,
            comment,
            timestamp: new Date(),
        };
        await this.redisClient.publish('recipe_updates', JSON.stringify(notification));
        this.server.to(`recipe:${recipeId}`).emit('new_comment', notification);
    }
    async notifyNewRecipe(recipe, authorId) {
        const followersKey = `followers:${authorId}`;
        const followers = await this.redisClient.smembers(followersKey);
        const notification = {
            type: 'NEW_RECIPE',
            recipe,
            authorId,
            timestamp: new Date(),
        };
        await this.redisClient.publish('user_updates', JSON.stringify(notification));
        followers.forEach(followerId => {
            this.server.to(`user:${followerId}`).emit('new_recipe', notification);
        });
    }
    async updateUserFollowers(userId, followerId, isFollowing) {
        const followersKey = `followers:${userId}`;
        if (isFollowing) {
            await this.redisClient.sadd(followersKey, followerId);
        }
        else {
            await this.redisClient.srem(followersKey, followerId);
        }
    }
    setupRedisSubscriptions() {
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
    handleRecipeUpdate(data) {
        switch (data.type) {
            case 'NEW_RATING':
                this.server.to(`recipe:${data.recipeId}`).emit('new_rating', data);
                break;
            case 'NEW_COMMENT':
                this.server.to(`recipe:${data.recipeId}`).emit('new_comment', data);
                break;
        }
    }
    handleUserUpdate(data) {
        if (data.type === 'NEW_RECIPE') {
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_recipe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "joinRecipe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_recipe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "leaveRecipe", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService])
], RealtimeGateway);
let RealtimeService = class RealtimeService {
    realtimeGateway;
    constructor(realtimeGateway) {
        this.realtimeGateway = realtimeGateway;
    }
    async notifyNewRating(recipeId, rating) {
        return this.realtimeGateway.notifyNewRating(recipeId, rating);
    }
    async notifyNewComment(recipeId, comment) {
        return this.realtimeGateway.notifyNewComment(recipeId, comment);
    }
    async notifyNewRecipe(recipe, authorId) {
        return this.realtimeGateway.notifyNewRecipe(recipe, authorId);
    }
    async updateUserFollowers(userId, followerId, isFollowing) {
        return this.realtimeGateway.updateUserFollowers(userId, followerId, isFollowing);
    }
};
exports.RealtimeService = RealtimeService;
exports.RealtimeService = RealtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RealtimeGateway])
], RealtimeService);
//# sourceMappingURL=realtime.service.js.map