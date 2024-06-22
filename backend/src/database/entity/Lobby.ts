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
import { dataSource } from "../../datasource";
import {
	LobbyPlayerView,
	MagnateLobbyView
} from "../../utils";
import { GameState } from "./GameState";
import { LobbyPlayer } from "./LobbyPlayer";
import { UserSession } from "./UserSession";

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
	@OneToMany(() => LobbyPlayer, (lp) => lp.lobby, {
		eager: true
	})
	lobbyPlayers!: LobbyPlayer[];

	@OneToOne(() => GameState, (gs) => gs.lobby)
	@JoinColumn()
	gameState: GameState | null = null;

	public async toLobbyData(): Promise<MagnateLobbyView> {
		const lobby = await dataSource
			.getRepository(Lobby)
			.createQueryBuilder("l")
			.leftJoinAndMapMany(
				"l.lobbyPlayers",
				LobbyPlayer,
				"lp",
				"lp.lobbyId = l.lobbyId"
			)
			.leftJoinAndMapOne(
				"lp.userSession",
				UserSession,
				"us"
			)
			.leftJoinAndMapOne(
				"l.gameState",
				GameState,
				"gs",
				"gs.lobbyId = l.lobbyId"
			)
			.where("l.lobbyId = :id", {
				id: this.lobbyId
			})
			.getOne();

		// const lobby = await LobbyRepository.preload({
		// 	lobbyId: this.lobbyId
		// });
		console.log(lobby);

		if (!lobby) {
			throw new Error("Could not find lobby");
		}

		return {
			lobbyName: lobby.name,
			lobbyId: lobby.lobbyId,
			lobbyPlayers: lobby.lobbyPlayers
				? lobby.lobbyPlayers.map((lobbyPlayer) => {
						return {
							name: lobbyPlayer.userSession
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

	public getHost(): UserSession {
		return this.lobbyPlayers[0].userSession;
	}
}

