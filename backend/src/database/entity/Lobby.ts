import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryColumn
} from "typeorm";

import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class Lobby extends BaseEntity {
	@PrimaryColumn()
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
}
