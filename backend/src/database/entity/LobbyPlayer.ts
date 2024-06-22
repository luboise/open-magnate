import {
	BaseEntity,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique
} from "typeorm";

import { LobbyPlayerView } from "../../utils";
import { Lobby } from "./Lobby";
import { Restaurant } from "./Restaurant";
import { SessionKey } from "./SessionKey";

@Entity()
@Unique(["lobby", "restaurant"])
export class LobbyPlayer extends BaseEntity {
	// @ManyToOne(() => Lobby, (lobby) => lobby.players)
	// @JoinColumn({ name: "lobbyId" })
	// lobby!: Lobby;

	@PrimaryGeneratedColumn()
	id!: number;

	@OneToOne(
		() => SessionKey,
		(sessionKey) => sessionKey.lobbyPlayer
	)
	@JoinColumn()
	sessionKey!: SessionKey;

	@ManyToOne(() => Lobby, (lobby) => lobby.lobbyPlayers)
	@JoinColumn({ name: "lobbyId" })
	lobby!: Lobby;

	@ManyToOne(
		() => Restaurant,
		(restaurant) => restaurant.lobbyPlayers
	)
	restaurant!: Restaurant;

	public toLobbyPlayerView(): LobbyPlayerView {
		return {
			name: this.sessionKey.name,
			restaurant: this.restaurant.name
		};
	}
}
