// House entity

import { Min } from "class-validator";
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryColumn,
	Unique
} from "typeorm";
import { GameState } from "./GameState";

@Unique(["gameState", "houseNum"])
@Entity()
export class House extends BaseEntity {
	@PrimaryColumn()
	houseNum: number = -1;

	@ManyToOne(() => GameState, (gs) => gs.houses)
	gameState!: GameState;

	@Column("int", { array: true })
	demand: Array<number> = [];

	@Column()
	@Min(3)
	demandLimit: number = 3;

	@Column()
	hasGarden: boolean = false;
}
