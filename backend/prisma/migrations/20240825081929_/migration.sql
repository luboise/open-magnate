-- AlterTable
ALTER TABLE `GameEvent` MODIFY `time_of_occurence` INTEGER NOT NULL DEFAULT UNIX_TIMESTAMP();

-- AlterTable
ALTER TABLE `game_state` MODIFY `game_start_timestamp` INTEGER NOT NULL DEFAULT UNIX_TIMESTAMP();
