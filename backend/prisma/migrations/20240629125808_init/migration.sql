-- DropForeignKey
ALTER TABLE `lobbyplayer` DROP FOREIGN KEY `LobbyPlayer_lobbyId_fkey`;

-- AddForeignKey
ALTER TABLE `LobbyPlayer` ADD CONSTRAINT `LobbyPlayer_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobby_id`) ON DELETE CASCADE ON UPDATE CASCADE;
