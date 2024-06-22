import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryColumn
} from "typeorm";

import { parseMap } from "../../game/Map";
import { GameStateView, TurnProgress } from "../../utils";
import { House } from "./House";
import { Lobby } from "./Lobby";
import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class GameState extends BaseEntity {
	@PrimaryColumn({ nullable: false })
	lobbyId!: number;

	@OneToOne(() => Lobby, (lobby) => lobby.gameState)
	lobby!: Lobby;

	@Column()
	turnProgress: TurnProgress = TurnProgress.SETTING_UP;

	@Column()
	currentTurn: number = 1;

	@OneToOne(() => LobbyPlayer, (lp) => lp.lobby)
	currentPlayer: LobbyPlayer | null = null;

	@Column()
	map: string = "";

	@OneToMany(() => House, (house) => house.gameState)
	houses!: Array<House>;

	@Column("int", { array: true })
	turnOrder: Array<number> = [];

	public toGameStateView(): GameStateView {
		return {
			currentPlayer: this.currentPlayer
				? this.lobby.lobbyPlayers.indexOf(
						this.currentPlayer
					)
				: -1,
			currentTurn: this.currentTurn,
			houses: this.houses,
			players: this.lobby.lobbyPlayers.map((lp) =>
				lp.toLobbyPlayerView()
			),
			mapPieces: parseMap(this.map) ?? [],
			turnOrder: this.turnOrder,
			turnProgress: this.turnProgress
		};
	}

	public setCurrentPlayer(player: LobbyPlayer) {
		if (this.lobby.lobbyPlayers.includes(player)) {
			this.currentPlayer = player;
		}
	}
}

