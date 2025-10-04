/*
  Warnings:

  - A unique constraint covering the columns `[listId,prodId,unitId]` on the table `ShoppingListItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ShoppingListItem_listId_prodId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingListItem_listId_prodId_unitId_key" ON "ShoppingListItem"("listId", "prodId", "unitId");
