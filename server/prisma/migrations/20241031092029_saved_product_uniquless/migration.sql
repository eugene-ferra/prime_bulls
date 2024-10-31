/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `SavedProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SavedProduct_userId_productId_key" ON "SavedProduct"("userId", "productId");
