/*
  Warnings:

  - A unique constraint covering the columns `[gameId,playerNumber,x,y]` on the table `game_player_restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `game_player_restaurant_gameId_playerNumber_x_y_key` ON `game_player_restaurant`(`gameId`, `playerNumber`, `x`, `y`);
