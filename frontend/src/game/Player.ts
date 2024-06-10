import { Employee } from "./Employee";

export type Player = {
	name: string;
	restaurant: number;
	money: number;
	employees: Array<Employee>;
};
