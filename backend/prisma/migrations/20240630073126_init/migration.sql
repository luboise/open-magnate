-- CreateTable
CREATE TABLE `user_session` (
    `sessionKey` VARCHAR(191) NOT NULL,
    `browserId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `user_session_sessionKey_key`(`sessionKey`),
    UNIQUE INDEX `user_session_browserId_key`(`browserId`),
    PRIMARY KEY (`sessionKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lobby_player` (
    `lobbyId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `timeJoined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `restaurantId` INTEGER NOT NULL,

    UNIQUE INDEX `lobby_player_userId_key`(`userId`),
    UNIQUE INDEX `lobby_player_restaurantId_lobbyId_key`(`restaurantId`, `lobbyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lobby` (
    `lobby_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `playerCount` INTEGER NOT NULL,
    `inviteCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`lobby_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant` (
    `restaurant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_state` (
    `gamestate_id` INTEGER NOT NULL,
    `rawMap` VARCHAR(2048) NOT NULL,
    `currentTurn` INTEGER NOT NULL DEFAULT 1,
    `currentPlayer` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`gamestate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_house` (
    `house_id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` INTEGER NOT NULL,
    `house_number` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `demandLimit` INTEGER NOT NULL DEFAULT 3,

    UNIQUE INDEX `game_house_gameId_house_number_key`(`gameId`, `house_number`),
    PRIMARY KEY (`house_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_house_garden` (
    `houseId` INTEGER NOT NULL AUTO_INCREMENT,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `orientation` ENUM('HORIZONTAL', 'VERTICAL') NOT NULL DEFAULT 'HORIZONTAL',

    PRIMARY KEY (`houseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_house_demand` (
    `houseId` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('BURGER', 'PIZZA', 'LEMONADE', 'BEER', 'COLA') NOT NULL,

    PRIMARY KEY (`houseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_marketing_campaign` (
    `gameId` INTEGER NOT NULL,
    `number` INTEGER NOT NULL,
    `type` ENUM('BILLBOARD', 'MAILBOX', 'PLANE', 'RADIO') NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `turnsRemaining` INTEGER NOT NULL,
    `orientation` ENUM('HORIZONTAL', 'VERTICAL') NOT NULL,

    UNIQUE INDEX `game_marketing_campaign_gameId_number_key`(`gameId`, `number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_player` (
    `gameId` INTEGER NOT NULL,
    `player_number` INTEGER NOT NULL,
    `money` INTEGER NOT NULL DEFAULT 0,
    `milestones` JSON NOT NULL,
    `employees` JSON NOT NULL,

    UNIQUE INDEX `game_player_gameId_player_number_key`(`gameId`, `player_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby`(`lobby_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user_session`(`sessionKey`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_state` ADD CONSTRAINT `game_state_gamestate_id_fkey` FOREIGN KEY (`gamestate_id`) REFERENCES `lobby`(`lobby_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_house` ADD CONSTRAINT `game_house_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game_state`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_house_garden` ADD CONSTRAINT `game_house_garden_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `game_house`(`house_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_house_demand` ADD CONSTRAINT `game_house_demand_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `game_house`(`house_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_marketing_campaign` ADD CONSTRAINT `game_marketing_campaign_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game_state`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_player` ADD CONSTRAINT `game_player_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game_state`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;
