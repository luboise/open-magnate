import {
	BaseEntity,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn
} from "typeorm";
import { SessionKey } from "./SessionKey";

@Entity()
export class User extends BaseEntity {
	@PrimaryColumn()
	name!: string;

	@OneToOne(() => SessionKey)
	@JoinColumn()
	authKey!: SessionKey;
}
