import { MoveType } from "magnate-core/game";
import RestaurantImage from "../../../global_components/RestaurantImage";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import usePageGame from "../../../hooks/game/usePageGame";
import "./TurnOrderPrompt.css";

import { HTMLAttributes, useCallback } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> { }

function TurnOrderPrompt({ ...args }: Props) {
	const {
		turnOrder,
		realTurnOrder,
		players,
		playerCount
	} = useDerivedGameState();
	const { makeMove } = usePageGame();

	const onSlotPicked = useCallback(
		(slot: number) =>
			makeMove({
				MoveType: MoveType.PICK_TURN_ORDER,
				slot: slot
			}),
		[]
	);

	return (
		<div className="turn-order-prompt" {...args}>
			<h2>Choose Turn Order</h2>
			<h3>Pick Order:</h3>
			<div className="players">
				{...turnOrder.map((playerNumber) => {
					const player = players.find(
						(p) =>
							p.playerNumber === playerNumber
					);
					if (!player) return <></>;

					return (
						<div className="player-piece">
							<RestaurantImage
								restaurantNumber={
									player.restaurant
								}
							/>
							{/* TODO: Put the employee tree into the public visibility area */}
							<span>{"?"} Empty Slots</span>
						</div>
					);
				})}
			</div>
			<div className="picks">
				{...new Array(playerCount)
					.fill(null)
					.map((_, index) => {
						if (realTurnOrder[index] === "X")
							return (
								<div
									onClick={() =>
										onSlotPicked(index)
									}
									className="turn-order-pick"
								>
									{index + 1}
								</div>
							);
						else
							return (
								<RestaurantImage
									restaurantNumber={
										players.find(
											(p) =>
												p.playerNumber ===
												turnOrder[
												index
												]
										)?.restaurant ?? 0
									}
								/>
							);
					})}
			</div>
		</div>
	);
}

export default TurnOrderPrompt;
