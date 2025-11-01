/*
  Warnings:

  - You are about to drop the column `conId` on the `ProductInstance` table. All the data in the column will be lost.
  - You are about to drop the `Container` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[locId,storId,prodId,unitId,expiresAt]` on the table `ProductInstance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storId` to the `ProductInstance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('Refrigerator', 'Freezer', 'Pantry', 'SpiceRack');

-- DropForeignKey
ALTER TABLE "public"."Container" DROP CONSTRAINT "Container_locId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductInstance" DROP CONSTRAINT "ProductInstance_conId_fkey";

-- DropIndex
DROP INDEX "public"."ProductInstance_locId_conId_prodId_unitId_expiresAt_key";

-- AlterTable
ALTER TABLE "ProductInstance" DROP COLUMN "conId",
ADD COLUMN     "storId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Container";

-- DropEnum
DROP TYPE "public"."ContainerType";

-- CreateTable
CREATE TABLE "StorageArea" (
    "_id" TEXT NOT NULL,
    "locId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StorageType" NOT NULL,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageArea_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StorageArea_name_key" ON "StorageArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInstance_locId_storId_prodId_unitId_expiresAt_key" ON "ProductInstance"("locId", "storId", "prodId", "unitId", "expiresAt");

-- AddForeignKey
ALTER TABLE "StorageArea" ADD CONSTRAINT "StorageArea_locId_fkey" FOREIGN KEY ("locId") REFERENCES "Location"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInstance" ADD CONSTRAINT "ProductInstance_storId_fkey" FOREIGN KEY ("storId") REFERENCES "StorageArea"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
