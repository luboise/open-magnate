import { Employee } from "./Employee";
import { Milestone } from "./Milestone";

export type Player = {
	playerNum: number;
	name: string;
	restaurant: number;
	money: number;
	employees: Array<Employee>;
	milestones: Array<Milestone>;
	food: Array<Food>;
};
