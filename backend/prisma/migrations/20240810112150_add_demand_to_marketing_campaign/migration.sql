/*
  Warnings:

  - Added the required column `demand` to the `game_marketing_campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `game_marketing_campaign` ADD COLUMN `demand` ENUM('BURGER', 'PIZZA', 'LEMONADE', 'BEER', 'COLA') NOT NULL;
