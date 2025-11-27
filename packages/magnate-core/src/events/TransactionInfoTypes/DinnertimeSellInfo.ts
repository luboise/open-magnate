import { BaseTransactionInfoInterface } from "../";
import { DemandType } from "../../game";

export interface DinnertimeSellInfo
	extends BaseTransactionInfoInterface {
	type: "DinnertimeSell";
	player: number;
	house: number;
	sold: DemandType[];
}
