-- CreateTable
CREATE TABLE `game_player_demand` (
    `demandId` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` INTEGER NOT NULL,
    `player_number` INTEGER NOT NULL,
    `type` ENUM('BURGER', 'PIZZA', 'LEMONADE', 'BEER', 'COLA') NOT NULL,

    PRIMARY KEY (`demandId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `game_player_demand` ADD CONSTRAINT `game_player_demand_gameId_player_number_fkey` FOREIGN KEY (`gameId`, `player_number`) REFERENCES `game_player`(`gameId`, `player_number`) ON DELETE CASCADE ON UPDATE CASCADE;
