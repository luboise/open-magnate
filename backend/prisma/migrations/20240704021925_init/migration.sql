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
    `isHost` BOOLEAN NOT NULL DEFAULT false,
    `lobbyId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `timeJoined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gameStateId` INTEGER NOT NULL,
    `playerNumber` INTEGER NOT NULL,

    UNIQUE INDEX `lobby_player_userId_key`(`userId`),
    UNIQUE INDEX `lobby_player_gameStateId_playerNumber_key`(`gameStateId`, `playerNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lobby` (
    `lobby_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `inviteCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`lobby_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_player` (
    `gameId` INTEGER NOT NULL,
    `player_number` INTEGER NOT NULL,
    `money` INTEGER NOT NULL DEFAULT 0,
    `milestones` JSON NOT NULL,
    `employees` JSON NOT NULL,
    `restaurantDataId` INTEGER NOT NULL,

    UNIQUE INDEX `game_player_gameId_player_number_key`(`gameId`, `player_number`),
    UNIQUE INDEX `game_player_gameId_restaurantDataId_key`(`gameId`, `restaurantDataId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_player_restaurant` (
    `gameId` INTEGER NOT NULL,
    `playerNumber` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `entrance` ENUM('TOPLEFT', 'TOPRIGHT', 'BOTTOMLEFT', 'BOTTOMRIGHT') NOT NULL,

    UNIQUE INDEX `game_player_restaurant_gameId_playerNumber_key`(`gameId`, `playerNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_state` (
    `gamestate_id` INTEGER NOT NULL,
    `turnProgress` ENUM('PREGAME', 'SETTING_UP', 'RESTAURANT_PLACEMENT', 'RESTRUCTURING', 'TURN_ORDER_SELECTION', 'USE_EMPLOYEES', 'SALARY_PAYOUTS', 'MARKETING_CAMPAIGNS', 'CLEAN_UP', 'POSTGAME') NOT NULL DEFAULT 'PREGAME',
    `rawMap` VARCHAR(2048) NOT NULL,
    `currentTurn` INTEGER NOT NULL DEFAULT 1,
    `currentPlayer` INTEGER NOT NULL DEFAULT 1,
    `playerCount` INTEGER NOT NULL,
    `turnOrder` VARCHAR(191) NOT NULL DEFAULT '1234',

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
CREATE TABLE `restaurant_data` (
    `restaurant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby`(`lobby_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user_session`(`sessionKey`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_gameStateId_playerNumber_fkey` FOREIGN KEY (`gameStateId`, `playerNumber`) REFERENCES `game_player`(`gameId`, `player_number`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_player` ADD CONSTRAINT `game_player_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game_state`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_player` ADD CONSTRAINT `game_player_restaurantDataId_fkey` FOREIGN KEY (`restaurantDataId`) REFERENCES `restaurant_data`(`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_player_restaurant` ADD CONSTRAINT `game_player_restaurant_gameId_playerNumber_fkey` FOREIGN KEY (`gameId`, `playerNumber`) REFERENCES `game_player`(`gameId`, `player_number`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
