import "./TurnOrderList.css";

import RestaurantImage from "../../../components/RestaurantImage";
import { useGameState } from "../../../hooks/useGameState";

interface TurnOrderListProps {
	orientation?: "Horizontal" | "Vertical";
}

function TurnOrderList(props: TurnOrderListProps) {
	const { state, players } = useGameState();

	return (
		<div
			className="game-turn-order-list"
			style={{
				flexDirection:
					props.orientation === "Vertical"
						? "column"
						: "row"
			}}
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
						<span
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
							/>
						</span>
					);
				}
			) ?? []}
		</div>
	);
}

export default TurnOrderList;
