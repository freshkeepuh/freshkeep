/*
  Warnings:

  - You are about to drop the column `unitsId` on the `GroceryItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitsId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `Units` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `unitId` to the `GroceryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."GroceryItem" DROP CONSTRAINT "GroceryItem_unitsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_unitsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Units" DROP CONSTRAINT "Units_baseId_fkey";

-- DropIndex
DROP INDEX "public"."Item_locId_conId_grocId_key";

-- AlterTable
ALTER TABLE "public"."GroceryItem" DROP COLUMN "unitsId",
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "unitsId",
ADD COLUMN     "unitId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Units";

-- CreateTable
CREATE TABLE "public"."Unit" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "baseId" TEXT,
    "factor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "public"."Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_abbr_key" ON "public"."Unit"("abbr");

-- CreateIndex
CREATE INDEX "category_name_idx" ON "public"."GroceryItem"("category", "name");

-- AddForeignKey
ALTER TABLE "public"."Unit" ADD CONSTRAINT "Unit_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "public"."Unit"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroceryItem" ADD CONSTRAINT "GroceryItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."Unit"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."Unit"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
