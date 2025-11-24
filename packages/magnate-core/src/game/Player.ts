import { Employee } from "./Employee";

export type Player = {
	money: number;
	employees: Employee[];
};

export const Player = {
	create() {
		return {
			money: 0,
			employees: []
		};
	}
} satisfies {
	create(): Player;
};
