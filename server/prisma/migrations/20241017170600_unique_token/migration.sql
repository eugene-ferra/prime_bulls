/*
  Warnings:

  - A unique constraint covering the columns `[userId,ip,userAgent]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_ip_userAgent_key" ON "Token"("userId", "ip", "userAgent");
