import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";

import { MinLength } from "class-validator";
import { MagnateLobbyData } from "../../utils";
import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class Lobby extends BaseEntity {
	@PrimaryGeneratedColumn()
	lobbyId!: number;

	@Column()
	@MinLength(1)
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
