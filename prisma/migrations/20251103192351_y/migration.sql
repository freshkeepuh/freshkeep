/*
  Warnings:

  - You are about to drop the column `groceryItemId` on the `Catalog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,catalogItemId]` on the table `Catalog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `catalogItemId` to the `Catalog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Catalog" DROP CONSTRAINT "Catalog_groceryItemId_fkey";

-- DropIndex
DROP INDEX "public"."Catalog_userId_groceryItemId_key";

-- AlterTable
ALTER TABLE "Catalog" DROP COLUMN "groceryItemId",
ADD COLUMN     "catalogItemId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Catalog_userId_catalogItemId_key" ON "Catalog"("userId", "catalogItemId");

-- AddForeignKey
ALTER TABLE "Catalog" ADD CONSTRAINT "Catalog_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "Product"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
