import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryColumn
} from "typeorm";

import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class Restaurant extends BaseEntity {
	@PrimaryColumn()
	restaurantId!: number;

	@Column()
	name!: string;

	@OneToMany(
		() => LobbyPlayer,
		(lobbyPlayer) => lobbyPlayer.restaurant
	)
	lobbyPlayers!: LobbyPlayer[];
}
