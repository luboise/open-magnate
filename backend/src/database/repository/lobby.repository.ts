import {
	dataSource,
	entityManager
} from "../../datasource";
import { Lobby } from "../entity/Lobby";
import { Restaurant } from "../entity/Restaurant";
import { UserSession } from "../entity/UserSession";
import LobbyPlayerRepository from "./lobbyplayer.repository";

const LobbyRepository = dataSource
	.getRepository(Lobby)
	.extend({
		// TODO: Fix null restaurant
		addPlayer(
			lobby: Lobby,
			player: UserSession,
			restaurant?: Restaurant
		) {
			try {
				const newLobbyPlayer =
					LobbyPlayerRepository.create({
						lobby: lobby,
						sessionKey: player,
						restaurant: restaurant || undefined
					});
				entityManager.save(newLobbyPlayer);

				if (!newLobbyPlayer) {
					console.log(
						`Failed to create LobbyPlayer for player ${player.name} in lobby ${lobby.lobbyId}`
					);
					return null;
				}

				console.log(
					`Created LobbyPlayer for player ${player.name} in lobby ${lobby.lobbyId}`
				);
				return newLobbyPlayer;
			} catch (error) {
				console.log(error);
			}
		}
	});

export default LobbyRepository;
