/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `StorageArea` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `StorageArea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "StorageType" ADD VALUE 'Other';

-- DropIndex
DROP INDEX "public"."Location_name_key";

-- DropIndex
DROP INDEX "public"."StorageArea_name_key";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StorageArea" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_userId_name_key" ON "Location"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "StorageArea_userId_name_key" ON "StorageArea"("userId", "name");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageArea" ADD CONSTRAINT "StorageArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
