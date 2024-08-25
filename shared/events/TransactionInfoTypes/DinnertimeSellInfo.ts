import { BaseTransactionInfoInterface } from "../";
import { DEMAND_TYPE } from "../../../backend/src/utils";

export interface DinnertimeSellInfo
	extends BaseTransactionInfoInterface {
	type: "DinnertimeSell";
	player: number;
	house: number;
	sold: DEMAND_TYPE[];
}
