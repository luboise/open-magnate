import "./TurnOrderList.css";

import { HTMLAttributes } from "react";
import RestaurantImage from "../../../global_components/RestaurantImage";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import useGameStateView from "../../../hooks/game/useGameStateView";

interface TurnOrderListProps
	extends HTMLAttributes<HTMLDivElement> {
	orientation?: "Horizontal" | "Vertical";
}

function TurnOrderList({
	orientation = "Horizontal",
	style,
	className,
	...args
}: TurnOrderListProps) {
	const { currentPlayer, turnOrder, players } =
		useDerivedGameState();

	const { gameState } = useGameStateView();


	return (
		<div
			className={`game-turn-order-list ${className}`}
			// style={{
			// 	flexDirection:
			// 		orientation === "Vertical"
			// 			? "column"
			// 			: "row",
			// 	...style
			// }}
			{...args}
		>
			{...turnOrder?.map((playerIndex) => {
				const player = players[playerIndex];
				if (!player) return <></>;

				return (
					<div
						style={{
							backgroundColor:
								gameState.currentPlayer === playerIndex
									? "red"
									: undefined
						}}
					>
						<RestaurantImage
							restaurantIndex={
								player.restaurantIndex
							}
							style={{ width: "100%" }}
						/>
					</div>
				);
			}) ?? []}
		</div>
	);
}

export default TurnOrderList;
