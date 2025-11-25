import { DemandRecord } from "@/game/demand/DemandRecord";
import { BaseMapTile } from "..";
import { Position } from "../area";

export interface HouseTile extends BaseMapTile {
	tileType: "HOUSE";
	houseNumber: number;
	demand: DemandRecord;
	width: 2;
	height: 2;
	rotation: 0;
}

export const HouseTile = {
	create(
		position: Position,
		houseNumber: number
	): HouseTile {
		return {
			position,
			houseNumber,

			// Default params
			tileType: "HOUSE",
			demand: DemandRecord.create(),
			width: 2,
			height: 2,
			rotation: 0
		};
	}
};
