-- CreateTable
CREATE TABLE "CartItemVariant" (
    "id" SERIAL NOT NULL,
    "cartItemId" INTEGER NOT NULL,
    "productVariantId" INTEGER NOT NULL,

    CONSTRAINT "CartItemVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItemVariant" ADD CONSTRAINT "CartItemVariant_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemVariant" ADD CONSTRAINT "CartItemVariant_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
