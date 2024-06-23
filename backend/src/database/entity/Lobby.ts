import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique
} from "typeorm";

import { Max, Min, MinLength } from "class-validator";
import { GameState } from "./GameState";
import { LobbyPlayer } from "./LobbyPlayer";
import { UserSession } from "./UserSession";

@Entity()
@Unique(["inviteCode"])
export class Lobby extends BaseEntity {
	@PrimaryGeneratedColumn()
	lobbyId!: number;

	@Column()
	@MinLength(1)
	name!: string;

	@Column()
	password!: string;

	@Column()
	inviteCode: string = (() =>
		Lobby.generateInviteCode())();

	@Column({ nullable: false })
	@Min(2)
	@Max(6)
	playerCount!: number;

	// @ManyToMany(() => Restaurant)
	// @JoinTable()
	// restaurants!: Restaurant[];
	@OneToMany(() => LobbyPlayer, (lp) => lp.lobby, {
		eager: true
	})
	lobbyPlayers!: LobbyPlayer[];

	@OneToOne(() => GameState, (gs) => gs.lobby)
	@JoinColumn()
	gameState: GameState | null = null;

	public getHost(): UserSession {
		return this.lobbyPlayers[0].userSession;
	}

	public static generateInviteCode(): string {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const array = new Uint8Array(8);
		crypto.getRandomValues(array);

		let inviteCode = "";
		for (let i = 0; i < array.length; i++) {
			inviteCode +=
				characters[array[i] % characters.length];
		}

		return array.reduce((acc, char) => {
			return (
				acc + characters[char % characters.length]
			);
		}, "");
		``;
	}
}
