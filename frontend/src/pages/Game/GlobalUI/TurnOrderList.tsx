import "./TurnOrderList.css";

import { HTMLAttributes } from "react";
import RestaurantImage from "../../../global_components/RestaurantImage";
import { useGameState } from "../../../hooks/game/useGameState";

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
	const { state, players } = useGameState();

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
			{...state?.turnOrder?.map(
				(playerNumber, index) => {
					const player = players?.find(
						(player) =>
							player.playerNumber ===
							playerNumber
					);
					if (!player) return <></>;

					return (
						<div
							style={{
								backgroundColor:
									state.currentPlayer ===
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
				}
			) ?? []}
		</div>
	);
}

export default TurnOrderList;