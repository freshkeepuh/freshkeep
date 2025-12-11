/*
  Warnings:

  - You are about to drop the column `prodId` on the `ShoppingListItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `ShoppingListItem` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `ShoppingListItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[listId,name]` on the table `ShoppingListItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ShoppingListItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ShoppingListItem" DROP CONSTRAINT "ShoppingListItem_listId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShoppingListItem" DROP CONSTRAINT "ShoppingListItem_prodId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShoppingListItem" DROP CONSTRAINT "ShoppingListItem_unitId_fkey";

-- DropIndex
DROP INDEX "public"."ShoppingListItem_listId_prodId_unitId_key";

-- AlterTable
ALTER TABLE "ShoppingListItem" DROP COLUMN "prodId",
DROP COLUMN "unitId",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingListItem_listId_name_key" ON "ShoppingListItem"("listId", "name");

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ShoppingList"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
