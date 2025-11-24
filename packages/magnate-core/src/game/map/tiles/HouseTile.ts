import { DemandRecord } from "@/game/demand/DemandRecord";
import { BaseMapTile } from "..";

export interface HouseTile extends BaseMapTile {
	tileType: "HOUSE";
	houseNumber: number;
	demand: DemandRecord;
}
