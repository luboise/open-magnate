import { TransactionInfo } from "@/events";

export interface GameEventView {
	time: Date;
	data: TransactionInfo[];
}
