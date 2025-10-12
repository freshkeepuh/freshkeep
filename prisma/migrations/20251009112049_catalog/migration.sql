-- CreateTable
CREATE TABLE "Catalog" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groceryItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Catalog_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Catalog_userId_groceryItemId_key" ON "Catalog"("userId", "groceryItemId");

-- AddForeignKey
ALTER TABLE "Catalog" ADD CONSTRAINT "Catalog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catalog" ADD CONSTRAINT "Catalog_groceryItemId_fkey" FOREIGN KEY ("groceryItemId") REFERENCES "Product"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
