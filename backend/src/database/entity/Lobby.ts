import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";

import { Max, Min, MinLength } from "class-validator";
import {
	LobbyPlayerView,
	MagnateLobbyView
} from "../../utils";
import LobbyRepository from "../repository/lobby.repository";
import { GameState } from "./GameState";
import { LobbyPlayer } from "./LobbyPlayer";
import { SessionKey } from "./SessionKey";

@Entity()
export class Lobby extends BaseEntity {
	@PrimaryGeneratedColumn()
	lobbyId!: number;

	@Column()
	@MinLength(1)
	name!: string;

	@Column()
	password!: string;

	@Column({ nullable: false })
	@Min(2)
	@Max(6)
	playerCount!: number;

	// @ManyToMany(() => Restaurant)
	// @JoinTable()
	// restaurants!: Restaurant[];
	@OneToMany(() => LobbyPlayer, (lp) => lp.lobby)
	lobbyPlayers!: LobbyPlayer[];

	@OneToOne(() => GameState, (gs) => gs.lobby)
	@JoinColumn()
	gameState: GameState | null = null;

	public async toLobbyData(): Promise<MagnateLobbyView> {
		// const lobby = await dataSource
		// 	.getRepository(Lobby)
		// 	.createQueryBuilder("lobby")
		// 	.leftJoinAndSelect(
		// 		"lobby.gameState",
		// 		"gameState"
		// 	)
		// 	.leftJoinAndSelect(
		// 		"lobby.lobbyPlayers",
		// 		"lobbyPlayers"
		// 	)
		// 	.leftJoinAndSelect(
		// 		"lobbyPlayers.sessionKey",
		// 		"sk"
		// 	)
		// 	.where("lobby.lobbyId = :id", {
		// 		id: this.lobbyId
		// 	})
		// 	.getOne();

		const lobby = await LobbyRepository.findOne({
			relations: [
				"gameState",
				"lobbyPlayers",
				"lobbyPlayers.sessionKey",
				// "lobbyPlayers.sessionKey.name",
				"lobbyPlayers.restaurant"
			],
			where: {
				lobbyId: this.lobbyId
			}
		});

		if (!lobby) {
			throw new Error("Could not find lobby");
		}

		console.log(lobby);

		return {
			lobbyName: lobby.name,
			lobbyId: lobby.lobbyId,
			lobbyPlayers: lobby.lobbyPlayers
				? lobby.lobbyPlayers.map((lobbyPlayer) => {
						return {
							name: lobbyPlayer.sessionKey
								.name,
							restaurant:
								lobbyPlayer.restaurant
									?.name ?? null
						} as LobbyPlayerView;
					})
				: [],
			gameState:
				lobby.gameState?.toGameStateView() || null
		};
	}

	public getHost(): SessionKey {
		return this.lobbyPlayers[0].sessionKey;
	}
}

