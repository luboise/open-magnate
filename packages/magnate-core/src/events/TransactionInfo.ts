import { DinnertimeSellInfo } from "./TransactionInfoTypes";

export * from "./TransactionInfoTypes";

export interface BaseTransactionInfoInterface {
	type: string;
	turn: number;
}

export type TransactionInfo = DinnertimeSellInfo;
