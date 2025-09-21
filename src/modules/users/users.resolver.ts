import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './dto/user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context() context: any) {
    return this.usersService.findById(context.req.user.id);
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Args('userId') userId: string,
    @Context() context: any,
  ) {
    await this.usersService.followUser(context.req.user.id, userId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Args('userId') userId: string,
    @Context() context: any,
  ) {
    await this.usersService.unfollowUser(context.req.user.id, userId);
    return true;
  }
}