import "./PlayerInventory.css";

import { useGameStateView } from "../../../hooks/game/useGameState";
import Demand from "../Map/Tiles/Demand";

type Props = {};

function PlayerInventory({}: Props) {
	const { playerData } = useGameStateView();
	return (
		<div id="player-inventory">
			{playerData.supply.map((item) => (
				<Demand demand={item} />
			))}
		</div>
	);
}

export default PlayerInventory;
