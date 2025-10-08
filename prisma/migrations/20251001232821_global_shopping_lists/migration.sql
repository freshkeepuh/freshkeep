/*
  Warnings:

  - You are about to drop the column `userId` on the `ShoppingList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId,createdAt]` on the table `ShoppingList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."ShoppingList" DROP CONSTRAINT "ShoppingList_userId_fkey";

-- DropIndex
DROP INDEX "public"."ShoppingList_userId_storeId_createdAt_key";

-- AlterTable
ALTER TABLE "ShoppingList" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingList_storeId_createdAt_key" ON "ShoppingList"("storeId", "createdAt");
