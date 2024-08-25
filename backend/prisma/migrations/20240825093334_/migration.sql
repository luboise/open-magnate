/*
  Warnings:

  - You are about to drop the column `data` on the `GameEvent` table. All the data in the column will be lost.
  - Added the required column `game_event_data` to the `GameEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameEvent` DROP COLUMN `data`,
    ADD COLUMN `game_event_data` JSON NOT NULL,
    MODIFY `time_of_occurence` INTEGER NOT NULL DEFAULT UNIX_TIMESTAMP();

-- AlterTable
ALTER TABLE `game_state` MODIFY `game_start_timestamp` INTEGER NOT NULL DEFAULT UNIX_TIMESTAMP();
