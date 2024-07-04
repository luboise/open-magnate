import "./TurnOrderList.css";

import { useGameState } from "../../../hooks/useGameState";

function TurnOrderList() {
	const { state, players } = useGameState();

	return (
		<div className="game-turn-order-list">
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
							#{index}: {player.restaurant}
						</div>
					);
				}
			) ?? []}
		</div>
	);
}

export default TurnOrderList;
