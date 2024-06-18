import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryColumn,
	Unique
} from "typeorm";

import { Lobby } from "./Lobby";
import { Restaurant } from "./Restaurant";

@Entity()
@Unique(["lobby", "restaurant"])
export class LobbyPlayer extends BaseEntity {
	// @ManyToOne(() => Lobby, (lobby) => lobby.players)
	// @JoinColumn({ name: "lobbyId" })
	// lobby!: Lobby;

	@PrimaryColumn()
	lobbyPlayerId!: number;

	@Column()
	name!: string;

	@ManyToOne(() => Lobby, (lobby) => lobby.lobbyPlayers)
	lobby!: Lobby;

	@ManyToOne(
		() => Restaurant,
		(restaurant) => restaurant.lobbyPlayers
	)
	restaurant!: Restaurant;
}
