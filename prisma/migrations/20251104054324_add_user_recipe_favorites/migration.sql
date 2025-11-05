-- CreateTable
CREATE TABLE "_RecipeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipeToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipeToUser_B_index" ON "_RecipeToUser"("B");

-- AddForeignKey
ALTER TABLE "_RecipeToUser" ADD CONSTRAINT "_RecipeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToUser" ADD CONSTRAINT "_RecipeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
