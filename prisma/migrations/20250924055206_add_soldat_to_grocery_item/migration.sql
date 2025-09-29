-- AlterTable
ALTER TABLE "public"."GroceryItem" ADD COLUMN     "soldAt" TEXT;

-- CreateTable
CREATE TABLE "public"."Shop" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groceryItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_userId_groceryItemId_key" ON "public"."Shop"("userId", "groceryItemId");

-- AddForeignKey
ALTER TABLE "public"."Shop" ADD CONSTRAINT "Shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shop" ADD CONSTRAINT "Shop_groceryItemId_fkey" FOREIGN KEY ("groceryItemId") REFERENCES "public"."GroceryItem"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
