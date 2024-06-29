-- DropForeignKey
ALTER TABLE `demand` DROP FOREIGN KEY `Demand_houseId_fkey`;

-- DropForeignKey
ALTER TABLE `gameplayer` DROP FOREIGN KEY `GamePlayer_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `gamestate` DROP FOREIGN KEY `GameState_gamestate_id_fkey`;

-- DropForeignKey
ALTER TABLE `garden` DROP FOREIGN KEY `Garden_houseId_fkey`;

-- DropForeignKey
ALTER TABLE `house` DROP FOREIGN KEY `House_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `marketingcampaign` DROP FOREIGN KEY `MarketingCampaign_gameId_fkey`;

-- AddForeignKey
ALTER TABLE `GameState` ADD CONSTRAINT `GameState_gamestate_id_fkey` FOREIGN KEY (`gamestate_id`) REFERENCES `Lobby`(`lobby_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `House` ADD CONSTRAINT `House_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `GameState`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Garden` ADD CONSTRAINT `Garden_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`house_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demand` ADD CONSTRAINT `Demand_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`house_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarketingCampaign` ADD CONSTRAINT `MarketingCampaign_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `GameState`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GamePlayer` ADD CONSTRAINT `GamePlayer_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `GameState`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;
