import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn
} from "typeorm";

import { Length } from "class-validator";
import crypto from "crypto";

@Entity()
export class SessionKey extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	sessionKey!: string;

	@Column({ nullable: false, unique: true })
	browserId!: string;

	// Random player name
	@Column({ nullable: false })
	@Length(1, 10)
	name: string = crypto
		.randomBytes(10)
		.toString("latin1");
}
