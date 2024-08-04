import { MOVE_TYPE } from "../../../../../shared/Moves";
import RestaurantImage from "../../../global_components/RestaurantImage";
import { useGameStateView } from "../../../hooks/game/useGameState";
import usePageGame from "../../../hooks/game/usePageGame";
import "./TurnOrderPrompt.css";

import { HTMLAttributes, useCallback } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}

function TurnOrderPrompt({ ...args }: Props) {
	const { turnOrder, players, playerCount } =
		useGameStateView();
	const { makeMove } = usePageGame();

	const onSlotPicked = useCallback(
		(slot: number) =>
			makeMove({
				MoveType: MOVE_TYPE.PICK_TURN_ORDER,
				slot: slot
			}),
		[]
	);

	return (
		<div className="turn-order-prompt" {...args}>
			<h2>Choose Turn Order</h2>
			<h3>Pick Order:</h3>
			<div className="players">
				{...turnOrder.map((playerNumber, index) => {
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
					.map((_, index) => (
						<div
							onClick={() =>
								onSlotPicked(index)
							}
						>
							{index + 1}
						</div>
					))}
			</div>
		</div>
	);
}

export default TurnOrderPrompt;

