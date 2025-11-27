import "./TurnOrderList.css";

import { HTMLAttributes } from "react";
import RestaurantImage from "../../../global_components/RestaurantImage";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";

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
			{...turnOrder?.map((playerNumber) => {
				const player = players?.find(
					(player) =>
						player.playerNumber === playerNumber
				);
				if (!player) return <></>;

				return (
					<div
						style={{
							backgroundColor:
								currentPlayer?.playerNumber ===
									playerNumber
									? "red"
									: undefined
						}}
					>
						<RestaurantImage
							restaurantNumber={
								player.restaurant
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
