-- AlterTable
ALTER TABLE `game_state` ADD COLUMN `game_start_timestamp` INTEGER NOT NULL DEFAULT UNIX_TIMESTAMP();

-- CreateTable
CREATE TABLE `GameEvent` (
    `game_event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_state_id` INTEGER NOT NULL,
    `time_of_occurence` INTEGER NOT NULL DEFAULT UNIX_TIMESTAMP(),
    `data` JSON NOT NULL,

    PRIMARY KEY (`game_event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameEvent` ADD CONSTRAINT `GameEvent_game_state_id_fkey` FOREIGN KEY (`game_state_id`) REFERENCES `game_state`(`gamestate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
