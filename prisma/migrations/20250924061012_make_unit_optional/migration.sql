-- DropForeignKey
ALTER TABLE "public"."GroceryItem" DROP CONSTRAINT "GroceryItem_unitId_fkey";

-- AlterTable
ALTER TABLE "public"."GroceryItem" ALTER COLUMN "unitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."GroceryItem" ADD CONSTRAINT "GroceryItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."Unit"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
