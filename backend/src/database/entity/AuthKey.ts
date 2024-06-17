import {
	BaseEntity,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";

import { User } from "./User";

@Entity()
export class AuthKey extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	key!: string;

	@OneToOne(() => User)
	@JoinColumn()
	user!: User;
}
