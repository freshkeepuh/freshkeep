-- CreateEnum
CREATE TYPE "public"."RecipeDifficulty" AS ENUM ('EASY', 'NORMAL', 'HARD');

-- CreateEnum
CREATE TYPE "public"."RecipeDiet" AS ENUM ('ANY', 'VEGAN', 'VEGETARIAN', 'PESCETARIAN');

-- CreateTable
CREATE TABLE "public"."Recipe" (
    "_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "difficulty" "public"."RecipeDifficulty" NOT NULL,
    "diet" "public"."RecipeDiet" NOT NULL,
    "ingredients" JSONB NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_title_key" ON "public"."Recipe"("title");
