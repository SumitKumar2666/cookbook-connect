import { ObjectType, Field, ID, InputType, Int, Float } from '@nestjs/graphql';
import { User } from '../../users/dto/user.dto';

@ObjectType()
export class Ingredient {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  quantity: string;

  @Field({ nullable: true })
  unit?: string;
}

@ObjectType()
export class Instruction {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  step: number;

  @Field()
  content: string;
}

@ObjectType()
export class Rating {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  value: number;

  @Field()
  createdAt: Date;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class Recipe {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  cuisine?: string;

  @Field()
  difficulty: string;

  @Field(() => Int)
  cookingTime: number;

  @Field(() => Int)
  servings: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  author: User;

  @Field(() => [Ingredient])
  ingredients: Ingredient[];

  @Field(() => [Instruction])
  instructions: Instruction[];

  @Field(() => [Rating])
  ratings: Rating[];

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => Float)
  averageRating: number;

  @Field(() => Int)
  totalRatings: number;
}

@InputType()
export class CreateIngredientInput {
  @Field()
  name: string;

  @Field()
  quantity: string;

  @Field({ nullable: true })
  unit?: string;
}

@InputType()
export class CreateInstructionInput {
  @Field(() => Int)
  step: number;

  @Field()
  content: string;
}

@InputType()
export class CreateRecipeInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  cuisine?: string;

  @Field()
  difficulty: string;

  @Field(() => Int)
  cookingTime: number;

  @Field(() => Int)
  servings: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [CreateIngredientInput])
  ingredients: CreateIngredientInput[];

  @Field(() => [CreateInstructionInput])
  instructions: CreateInstructionInput[];
}

@InputType()
export class UpdateRecipeInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  cuisine?: string;

  @Field({ nullable: true })
  difficulty?: string;

  @Field(() => Int, { nullable: true })
  cookingTime?: number;

  @Field(() => Int, { nullable: true })
  servings?: number;

  @Field({ nullable: true })
  imageUrl?: string;
}

@InputType()
export class RecipeFilters {
  @Field({ nullable: true })
  cuisine?: string;

  @Field({ nullable: true })
  difficulty?: string;

  @Field(() => Int, { nullable: true })
  maxCookingTime?: number;

  @Field(() => [String], { nullable: true })
  ingredients?: string[];

  @Field(() => Float, { nullable: true })
  minRating?: number;
}