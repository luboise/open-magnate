import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";

import { Length } from "class-validator";
import crypto from "crypto";
import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class UserSession extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	sessionKey!: string;

	@Column({ nullable: false, unique: true })
	browserId!: string;

	// Random player name
	@Column({ nullable: false })
	@Length(1, 10)
	name: string = (() =>
		crypto.randomBytes(10).toString("ascii"))();

	@OneToOne(() => LobbyPlayer)
	@JoinColumn()
	lobbyPlayer!: LobbyPlayer;
}
