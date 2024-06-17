import {
	BaseEntity,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn
} from "typeorm";
import { AuthKey } from "./AuthKey";

@Entity()
export class User extends BaseEntity {
	@PrimaryColumn()
	name!: string;

	@OneToOne(() => AuthKey)
	@JoinColumn()
	authKey!: AuthKey;
}
