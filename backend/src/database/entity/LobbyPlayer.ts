import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	Unique
} from "typeorm";

import { LobbyPlayerView } from "../../utils";
import { Lobby } from "./Lobby";
import { Restaurant } from "./Restaurant";
import { UserSession } from "./UserSession";

@Entity()
@Unique(["lobbyId", "restaurantId"])
export class LobbyPlayer extends BaseEntity {
	// @ManyToOne(() => Lobby, (lobby) => lobby.players)
	// @JoinColumn({ name: "lobbyId" })
	// lobby!: Lobby;

	// Foreign key
	@OneToOne(
		() => UserSession,
		(userSession) => userSession.lobbyPlayer
	)
	@JoinColumn({ name: "sessionKey" })
	userSession!: UserSession;

	@PrimaryColumn()
	sessionKey!: string;

	@Column("datetime")
	timeJoined: Date = new Date();

	// Foreign key
	@ManyToOne(() => Lobby, (lobby) => lobby.lobbyPlayers)
	@JoinColumn({ name: "lobbyId" })
	lobby!: Lobby;

	@PrimaryColumn()
	lobbyId!: number;

	@ManyToOne(
		() => Restaurant,
		(restaurant) => restaurant.lobbyPlayers
	)
	@JoinColumn({ name: "restaurantId" })
	restaurant!: Restaurant;

	@Column()
	restaurantId!: number;

	public toLobbyPlayerView(): LobbyPlayerView {
		return {
			name: this.userSession.name,
			restaurant: this.restaurant.name
		};
	}
}
