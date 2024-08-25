import { Prisma } from "@prisma/client";
import { TransactionInfo } from "../../../../shared";

export type MoveTransactionFunctionUntyped = (
	bundle: TransactionBundle
) => Promise<any>;

export type MoveTransactionFunctionTyped<T> = (
	bundle: TransactionBundle,
	details: T
) => Promise<any>;

export type MoveTransactionFunction =
	| MoveTransactionFunctionUntyped
	| MoveTransactionFunctionTyped<any>;

export interface TransactionBundle {
	ctx: Prisma.TransactionClient;
	transactionInfo: TransactionInfo[];
	gameId: number;
	currentTurn: number;
	player: number;
}

export type HouseDistances = Record<number, number | null>;
