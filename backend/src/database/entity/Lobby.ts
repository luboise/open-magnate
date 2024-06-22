import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";

import { Max, Min, MinLength } from "class-validator";
import {
	LobbyPlayerView,
	MagnateLobbyView
} from "../../utils";
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
	gameState: GameState | null = null;

	public toLobbyData(): MagnateLobbyView {
		return {
			lobbyName: this.name,
			lobbyId: this.lobbyId,
			lobbyPlayers:
				this.lobbyPlayers.map((lobbyPlayer) => {
					return {
						name: lobbyPlayer.sessionKey.name,
						restaurant:
							lobbyPlayer.restaurant.name
					} as LobbyPlayerView;
				}) || [],
			gameState:
				this.gameState?.toGameStateView() || null
		};
	}

	public getHost(): SessionKey {
		return this.lobbyPlayers[0].sessionKey;
	}
}

