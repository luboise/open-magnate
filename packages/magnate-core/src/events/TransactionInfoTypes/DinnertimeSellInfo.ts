import { DemandType } from "@/game/demand";
import { BaseTransactionInfoInterface } from "../";

export interface DinnertimeSellInfo
	extends BaseTransactionInfoInterface {
	type: "DinnertimeSell";
	player: number;
	house: number;
	sold: DemandType[];
}
