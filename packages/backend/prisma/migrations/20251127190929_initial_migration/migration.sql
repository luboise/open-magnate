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
    `playerIndex` INTEGER NOT NULL,

    UNIQUE INDEX `lobby_player_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lobby` (
    `lobby_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `inviteCode` VARCHAR(191) NOT NULL,
    `gameState` JSON NOT NULL,
    `lobbyStatus` ENUM('PRE_LOBBY', 'IN_GAME', 'POST_LOBBY') NOT NULL DEFAULT 'PRE_LOBBY',

    PRIMARY KEY (`lobby_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby`(`lobby_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lobby_player` ADD CONSTRAINT `lobby_player_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user_session`(`sessionKey`) ON DELETE RESTRICT ON UPDATE CASCADE;
