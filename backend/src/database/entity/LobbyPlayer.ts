import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	Unique
} from "typeorm";

import { Lobby } from "./Lobby";
import { Restaurant } from "./Restaurant";
import { SessionKey } from "./SessionKey";

@Entity()
@Unique(["lobby", "restaurant"])
export class LobbyPlayer extends BaseEntity {
	// @ManyToOne(() => Lobby, (lobby) => lobby.players)
	// @JoinColumn({ name: "lobbyId" })
	// lobby!: Lobby;

	@PrimaryColumn()
	lobbyPlayerId!: number;

	@OneToOne(
		() => SessionKey,
		(sessionKey) => sessionKey.lobbyPlayer
	)
	@Column()
	sessionKey!: string;

	@ManyToOne(() => Lobby, (lobby) => lobby.lobbyPlayers)
	lobby!: Lobby;

	@ManyToOne(
		() => Restaurant,
		(restaurant) => restaurant.lobbyPlayers
	)
	restaurant!: Restaurant;
}

