-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Country" AS ENUM ('USA', 'CAN');

-- CreateEnum
CREATE TYPE "public"."ContainerType" AS ENUM ('Refrigerator', 'Freezer', 'Pantry', 'SpiceRack');

-- CreateEnum
CREATE TYPE "public"."GroceryCategory" AS ENUM ('Fruits', 'Vegetables', 'CannedGoods', 'Dairy', 'Meat', 'FishSeafood', 'Deli', 'Condiments', 'Spices', 'Snacks', 'Bakery', 'Beverages', 'Pasta', 'Grains', 'Cereal', 'Baking', 'FrozenFoods', 'Other');

-- CreateEnum
CREATE TYPE "public"."MeasurementSystem" AS ENUM ('Imperial', 'Metric');

-- CreateTable
CREATE TABLE "public"."User" (
    "_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "measure" "public"."MeasurementSystem" NOT NULL DEFAULT 'Imperial',
    "country" "public"."Country" NOT NULL DEFAULT 'USA',
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

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

-- CreateTable
CREATE TABLE "public"."Location" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "country" "public"."Country" NOT NULL DEFAULT 'USA',
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "public"."Container" (
    "_id" TEXT NOT NULL,
    "locId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ContainerType" NOT NULL,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "public"."GroceryItem" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."GroceryCategory" NOT NULL,
    "unitId" TEXT NOT NULL,
    "defaultQty" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isNeeded" BOOLEAN NOT NULL DEFAULT false,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroceryItem_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "public"."Item" (
    "_id" TEXT NOT NULL,
    "locId" TEXT NOT NULL,
    "conId" TEXT NOT NULL,
    "grocId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "expiresAt" TIMESTAMP(3),
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "public"."Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_abbr_key" ON "public"."Unit"("abbr");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "public"."Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Container_name_key" ON "public"."Container"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GroceryItem_name_key" ON "public"."GroceryItem"("name");

-- CreateIndex
CREATE INDEX "category_name_idx" ON "public"."GroceryItem"("category", "name");

-- AddForeignKey
ALTER TABLE "public"."Unit" ADD CONSTRAINT "Unit_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "public"."Unit"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Container" ADD CONSTRAINT "Container_locId_fkey" FOREIGN KEY ("locId") REFERENCES "public"."Location"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroceryItem" ADD CONSTRAINT "GroceryItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."Unit"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_locId_fkey" FOREIGN KEY ("locId") REFERENCES "public"."Location"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_conId_fkey" FOREIGN KEY ("conId") REFERENCES "public"."Container"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_grocId_fkey" FOREIGN KEY ("grocId") REFERENCES "public"."GroceryItem"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."Unit"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
