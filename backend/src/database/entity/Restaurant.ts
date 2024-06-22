import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryColumn
} from "typeorm";

import { RESTAURANT_NAME } from "../../utils";
import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class Restaurant extends BaseEntity {
	@PrimaryColumn()
	restaurantId!: number;

	@Column()
	name!: RESTAURANT_NAME;

	@OneToMany(
		() => LobbyPlayer,
		(lobbyPlayer) => lobbyPlayer.restaurant
	)
	lobbyPlayers!: LobbyPlayer[];
}
