import { BaseTransactionInfoInterface } from "../";
import { DemandType } from "../../demand";

export interface DinnertimeSellInfo
	extends BaseTransactionInfoInterface {
	type: "DinnertimeSell";
	player: number;
	house: number;
	sold: DemandType[];
}
