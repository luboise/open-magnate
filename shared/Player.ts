import { Employee } from "../frontend/src/game/Employee";
import { Milestone } from "../frontend/src/game/Milestone";
import { Food } from "../frontend/src/utils";

export type Player = {
	playerNum: number;
	name: string;
	restaurant: number;
	money: number;
	employees: Array<Employee>;
	milestones: Array<Milestone>;
	food: Array<Food>;
};
