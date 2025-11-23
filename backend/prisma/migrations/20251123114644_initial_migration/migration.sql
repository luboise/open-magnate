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
    `timeJoined` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
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
    `is_ready` ENUM('NOT_READY', 'READY', 'NOT_APPLICABLE') NOT NULL DEFAULT 'NOT_APPLICABLE',
    `money` INTEGER NOT NULL DEFAULT 0,
    `milestones` JSON NOT NULL,
    `employees` JSON NOT NULL,
    `employeeTree` VARCHAR(1000) NOT NULL DEFAULT '0[X,X,X]',
    `restaurantDataId` INTEGER NOT NULL,

    UNIQUE INDEX `game_player_gameId_restaurantDataId_key`(`gameId`, `restaurantDataId`),
    PRIMARY KEY (`gameId`, `player_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_player_restaurant` (
    `game_player_restaurant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` INTEGER NOT NULL,
    `playerNumber` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `entrance` ENUM('TOPLEFT', 'TOPRIGHT', 'BOTTOMLEFT', 'BOTTOMRIGHT') NOT NULL,

    UNIQUE INDEX `game_player_restaurant_gameId_playerNumber_x_y_key`(`gameId`, `playerNumber`, `x`, `y`),
    PRIMARY KEY (`game_player_restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameEvent` (
    `game_event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_state_id` INTEGER NOT NULL,
    `time_of_occurence` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `game_event_data` JSON NOT NULL,

    PRIMARY KEY (`game_event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_state` (
    `gamestate_id` INTEGER NOT NULL,
    `game_start_timestamp` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `turnProgress` ENUM('PREGAME', 'SETTING_UP', 'RESTAURANT_PLACEMENT', 'RESTRUCTURING', 'TURN_ORDER_SELECTION', 'USE_EMPLOYEES', 'SALARY_PAYOUTS', 'MARKETING_CAMPAIGNS', 'CLEAN_UP', 'POSTGAME') NOT NULL DEFAULT 'PREGAME',
    `turnProgressDetails` JSON NULL,
    `rawMap` VARCHAR(2048) NOT NULL,
    `currentTurn` INTEGER NOT NULL DEFAULT 1,
    `playerCount` INTEGER NOT NULL,
    `turnOrder` VARCHAR(191) NOT NULL,
    `oldTurnOrder` VARCHAR(191) NOT NULL,
    `reserve` JSON NOT NULL,

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
    `demandId` INTEGER NOT NULL AUTO_INCREMENT,
    `houseId` INTEGER NOT NULL,
    `type` ENUM('BURGER', 'PIZZA', 'LEMONADE', 'BEER', 'COLA') NOT NULL,

    PRIMARY KEY (`demandId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_player_demand` (
    `demandId` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` INTEGER NOT NULL,
    `player_number` INTEGER NOT NULL,
    `type` ENUM('BURGER', 'PIZZA', 'LEMONADE', 'BEER', 'COLA') NOT NULL,

    PRIMARY KEY (`demandId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_marketing_campaign` (
    `marketingNumber` INTEGER NOT NULL,
    `gameId` INTEGER NOT NULL,
    `player_number` INTEGER NOT NULL,
    `employeeIndex` INTEGER NOT NULL,
    `type` ENUM('BILLBOARD', 'MAILBOX', 'PLANE', 'RADIO') NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `turnsRemaining` INTEGER NOT NULL,
    `orientation` ENUM('HORIZONTAL', 'VERTICAL') NOT NULL,
    `demand` ENUM('BURGER', 'PIZZA', 'LEMONADE', 'BEER', 'COLA') NOT NULL,

    UNIQUE INDEX `game_marketing_campaign_gameId_marketingNumber_key`(`gameId`, `marketingNumber`),
    UNIQUE INDEX `game_marketing_campaign_gameId_player_number_employeeIndex_key`(`gameId`, `player_number`, `employeeIndex`)
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
ALTER TABLE `GameEvent` ADD CONSTRAINT `GameEvent_game_state_id_fkey` FOREIGN KEY (`game_state_id`) REFERENCES `game_state`(`gamestate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_state` ADD CONSTRAINT `game_state_gamestate_id_fkey` FOREIGN KEY (`gamestate_id`) REFERENCES `lobby`(`lobby_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_house` ADD CONSTRAINT `game_house_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game_state`(`gamestate_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_house_garden` ADD CONSTRAINT `game_house_garden_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `game_house`(`house_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_house_demand` ADD CONSTRAINT `game_house_demand_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `game_house`(`house_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_player_demand` ADD CONSTRAINT `game_player_demand_gameId_player_number_fkey` FOREIGN KEY (`gameId`, `player_number`) REFERENCES `game_player`(`gameId`, `player_number`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_marketing_campaign` ADD CONSTRAINT `game_marketing_campaign_gameId_player_number_fkey` FOREIGN KEY (`gameId`, `player_number`) REFERENCES `game_player`(`gameId`, `player_number`) ON DELETE CASCADE ON UPDATE CASCADE;
