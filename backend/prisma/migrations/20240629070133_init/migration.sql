/*
  Warnings:

  - A unique constraint covering the columns `[sessionKey]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserSession_sessionKey_key` ON `UserSession`(`sessionKey`);
