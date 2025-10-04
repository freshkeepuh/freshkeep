/*
  Warnings:

  - You are about to drop the column `picture` on the `ProductInstance` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `ShoppingListItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ShoppingList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ShoppingListItem" DROP CONSTRAINT "ShoppingListItem_storeId_fkey";

-- AlterTable
ALTER TABLE "ProductInstance" DROP COLUMN "picture";

-- AlterTable
ALTER TABLE "ShoppingList" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingListItem" DROP COLUMN "storeId";

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingList_name_key" ON "ShoppingList"("name");
