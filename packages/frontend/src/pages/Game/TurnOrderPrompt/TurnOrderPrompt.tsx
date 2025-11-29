import RestaurantImage from "../../../global_components/RestaurantImage";
import usePageGame from "../../../hooks/game/usePageGame";
import "./TurnOrderPrompt.css";

import { HTMLAttributes, useCallback } from "react";
import useGameStateView from "../../../hooks/game/useGameStateView";
import { MoveType } from "magnate-core";

interface Props extends HTMLAttributes<HTMLDivElement> { }

function TurnOrderPrompt({ ...args }: Props) {
	const { gameState } = useGameStateView();

	const { makeMove } = usePageGame();

	const onSlotPicked = useCallback(
		(slot: number) =>
			makeMove({
				moveType: MoveType.SELECT_TURN_ORDER,
				slot: slot
			}),
		[]
	);

	return (
		<div className="turn-order-prompt" {...args}>
			<h2>Choose Turn Order</h2>
			<h3>Pick Order:</h3>
			<div className="players">
				{...gameState!.turnOrder.map((playerIndex) => {
					const player = gameState!.players[playerIndex]

					return (
						<div className="player-piece">
							<RestaurantImage
								restaurantIndex={
									player.restaurantIndex
								}
							/>
							<span>{"?"} Empty Slots</span>
						</div>
					);
				})}
			</div>
			<div className="picks">
				{...(gameState!.newTurnOrder
					.map((_, index) => {
						if (gameState!.newTurnOrder[index] === null)
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
									restaurantIndex={
										gameState!.players[index].restaurantIndex ?? 0
									}
								/>
							);
					}) ?? [])}
			</div>
		</div>
	);
}

export default TurnOrderPrompt;
