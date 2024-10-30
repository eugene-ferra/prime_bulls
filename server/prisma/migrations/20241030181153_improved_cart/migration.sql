/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `CartItemVariant` table. All the data in the column will be lost.
  - Added the required column `variantNameId` to the `CartItemVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantValueId` to the `CartItemVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItemVariant" DROP CONSTRAINT "CartItemVariant_productVariantId_fkey";

-- AlterTable
ALTER TABLE "CartItemVariant" DROP COLUMN "productVariantId",
ADD COLUMN     "variantNameId" INTEGER NOT NULL,
ADD COLUMN     "variantValueId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItemVariant" ADD CONSTRAINT "CartItemVariant_variantNameId_fkey" FOREIGN KEY ("variantNameId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemVariant" ADD CONSTRAINT "CartItemVariant_variantValueId_fkey" FOREIGN KEY ("variantValueId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
