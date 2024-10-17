/*
  Warnings:

  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ip` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_tokerId_fkey";

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL;

-- DropTable
DROP TABLE "Device";
