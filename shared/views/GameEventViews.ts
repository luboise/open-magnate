import { GameEvent } from "..";
import { parseJsonArray } from "../../backend/src/utils";
import { TransactionInfo } from "../events";

export interface GameEventView {
	time: number;
	data: TransactionInfo[];
}

export function CreateGameEventView(
	event: GameEvent
): GameEventView {
	const arr = parseJsonArray(event.eventData).map((val) =>
		JSON.parse(val)
	) as TransactionInfo[];

	const data: GameEventView = {
		time: event.time,
		data: arr
	};

	return data;
}
