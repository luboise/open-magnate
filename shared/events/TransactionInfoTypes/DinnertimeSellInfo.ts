import { DemandType } from "@shared/demand/Supply";
import { BaseTransactionInfoInterface } from "../";

export interface DinnertimeSellInfo
	extends BaseTransactionInfoInterface {
	type: "DinnertimeSell";
	player: number;
	house: number;
	sold: DemandType[];
}
