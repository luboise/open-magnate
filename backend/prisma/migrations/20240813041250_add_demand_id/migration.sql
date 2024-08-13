/*
  Warnings:

  - The primary key for the `game_house_demand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `demandId` to the `game_house_demand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `game_house_demand` DROP PRIMARY KEY,
    ADD COLUMN `demandId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `houseId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`demandId`);
