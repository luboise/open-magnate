import "./PlayerInventory.css";

import { useGameStateView } from "../../../hooks/game/useGameState";
import GameDemandTile from "./DemandPreview";

type Props = {};

function PlayerInventory({ }: Props) {
	const { playerData } = useGameStateView();
	return (
		<div id="player-inventory">
			{playerData.supply.map((item) => (
				<GameDemandTile demand={item} />
			))}
		</div>
	);
}

export default PlayerInventory;
