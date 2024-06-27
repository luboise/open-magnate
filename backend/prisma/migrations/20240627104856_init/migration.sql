-- CreateTable
CREATE TABLE `UserSession` (
    `sessionKey` VARCHAR(191) NOT NULL,
    `browserId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `UserSession_browserId_key`(`browserId`),
    PRIMARY KEY (`sessionKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LobbyPlayer` (
    `lobbyId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `timeJoined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `restaurantId` INTEGER NOT NULL,

    UNIQUE INDEX `LobbyPlayer_userId_key`(`userId`),
    UNIQUE INDEX `LobbyPlayer_restaurantId_lobbyId_key`(`restaurantId`, `lobbyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lobby` (
    `lobby_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `playerCount` INTEGER NOT NULL,
    `inviteCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`lobby_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Restaurant` (
    `restaurant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameState` (
    `gamestate_id` INTEGER NOT NULL,
    `rawMap` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`gamestate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `House` (
    `house_id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` INTEGER NOT NULL,
    `house_number` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `demandLimit` INTEGER NOT NULL DEFAULT 3,

    UNIQUE INDEX `House_gameId_house_number_key`(`gameId`, `house_number`),
    PRIMARY KEY (`house_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Garden` (
    `houseId` INTEGER NOT NULL AUTO_INCREMENT,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `orientation` ENUM('HORIZONTAL', 'VERTICAL') NOT NULL DEFAULT 'HORIZONTAL',

    PRIMARY KEY (`houseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Demand` (
    `houseId` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('BURGER', 'PIZZA', 'LEMONADE', 'BEER', 'COLA') NOT NULL,

    PRIMARY KEY (`houseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarketingCampaign` (
    `gameId` INTEGER NOT NULL,
    `number` INTEGER NOT NULL,
    `type` ENUM('BILLBOARD', 'MAILBOX', 'PLANE', 'RADIO') NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `turnsRemaining` INTEGER NOT NULL,
    `orientation` ENUM('HORIZONTAL', 'VERTICAL') NOT NULL,

    UNIQUE INDEX `MarketingCampaign_gameId_number_key`(`gameId`, `number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GamePlayer` (
    `gameId` INTEGER NOT NULL,
    `player_number` INTEGER NOT NULL,
    `money` INTEGER NOT NULL DEFAULT 0,
    `milestones` JSON NOT NULL,
    `employees` JSON NOT NULL,

    UNIQUE INDEX `GamePlayer_gameId_player_number_key`(`gameId`, `player_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LobbyPlayer` ADD CONSTRAINT `LobbyPlayer_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobby_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LobbyPlayer` ADD CONSTRAINT `LobbyPlayer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserSession`(`sessionKey`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LobbyPlayer` ADD CONSTRAINT `LobbyPlayer_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameState` ADD CONSTRAINT `GameState_gamestate_id_fkey` FOREIGN KEY (`gamestate_id`) REFERENCES `Lobby`(`lobby_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `House` ADD CONSTRAINT `House_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `GameState`(`gamestate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Garden` ADD CONSTRAINT `Garden_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`house_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demand` ADD CONSTRAINT `Demand_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`house_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarketingCampaign` ADD CONSTRAINT `MarketingCampaign_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `GameState`(`gamestate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GamePlayer` ADD CONSTRAINT `GamePlayer_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `GameState`(`gamestate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
