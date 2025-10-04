/*
  Warnings:

  - You are about to drop the `GroceryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('Fruits', 'Vegetables', 'CannedGoods', 'Dairy', 'Meat', 'FishSeafood', 'Deli', 'Condiments', 'Spices', 'Snacks', 'Bakery', 'Beverages', 'Pasta', 'Grains', 'Cereal', 'Baking', 'FrozenFoods', 'Other');

-- DropForeignKey
ALTER TABLE "public"."GroceryItem" DROP CONSTRAINT "GroceryItem_unitId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_conId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_grocId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_locId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_unitId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shop" DROP CONSTRAINT "Shop_groceryItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shop" DROP CONSTRAINT "Shop_userId_fkey";

-- DropTable
DROP TABLE "public"."GroceryItem";

-- DropTable
DROP TABLE "public"."Item";

-- DropTable
DROP TABLE "public"."Shop";

-- DropEnum
DROP TYPE "public"."GroceryCategory";

-- CreateTable
CREATE TABLE "Product" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" "ProductCategory" NOT NULL,
    "unitId" TEXT NOT NULL,
    "defaultQty" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isNeeded" BOOLEAN NOT NULL DEFAULT false,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ProductInstance" (
    "_id" TEXT NOT NULL,
    "locId" TEXT NOT NULL,
    "conId" TEXT NOT NULL,
    "prodId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "expiresAt" TIMESTAMP(3),
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInstance_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ShoppingList" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingList_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "_id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "prodId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "unitId" TEXT NOT NULL,
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingListItem_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Store" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipcode" TEXT,
    "country" "Country" NOT NULL DEFAULT 'USA',
    "phone" TEXT,
    "website" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "_ProductToStore" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToStore_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE INDEX "category_name_idx" ON "Product"("category", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInstance_locId_conId_prodId_unitId_expiresAt_key" ON "ProductInstance"("locId", "conId", "prodId", "unitId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingList_userId_storeId_createdAt_key" ON "ShoppingList"("userId", "storeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingListItem_listId_prodId_key" ON "ShoppingListItem"("listId", "prodId");

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_key" ON "Store"("name");

-- CreateIndex
CREATE INDEX "_ProductToStore_B_index" ON "_ProductToStore"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInstance" ADD CONSTRAINT "ProductInstance_locId_fkey" FOREIGN KEY ("locId") REFERENCES "Location"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInstance" ADD CONSTRAINT "ProductInstance_conId_fkey" FOREIGN KEY ("conId") REFERENCES "Container"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInstance" ADD CONSTRAINT "ProductInstance_prodId_fkey" FOREIGN KEY ("prodId") REFERENCES "Product"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInstance" ADD CONSTRAINT "ProductInstance_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ShoppingList"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_prodId_fkey" FOREIGN KEY ("prodId") REFERENCES "Product"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStore" ADD CONSTRAINT "_ProductToStore_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStore" ADD CONSTRAINT "_ProductToStore_B_fkey" FOREIGN KEY ("B") REFERENCES "Store"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
