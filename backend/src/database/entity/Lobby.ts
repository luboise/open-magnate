import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";

import { MagnateLobbyData } from "../../utils";
import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class Lobby extends BaseEntity {
	@PrimaryGeneratedColumn()
	lobbyId!: number;

	@Column()
	name!: string;

	@Column()
	password!: string;

	// @ManyToMany(() => Restaurant)
	// @JoinTable()
	// restaurants!: Restaurant[];

	@OneToMany(() => LobbyPlayer, (lp) => lp.lobby)
	lobbyPlayers!: LobbyPlayer[];

	public toLobbyData(): MagnateLobbyData {
		return {
			lobbyName: this.name,
			gameState: null,
			lobbyId: this.lobbyId,
			lobbyPlayers: this.lobbyPlayers || []
		};
	}
}
