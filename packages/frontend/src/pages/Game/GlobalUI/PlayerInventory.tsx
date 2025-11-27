import "./PlayerInventory.css";

import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import GameDemandTile from "./DemandPreview";
import { DemandRecord } from "magnate-core";

type Props = {};

function PlayerInventory({ }: Props) {
	const { publicPlayerData } = useDerivedGameState();
	return (
		<div id="player-inventory">
			{DemandRecord.toDemands(publicPlayerData.demand).map((item) => (
				<GameDemandTile demand={item} />
			))}
		</div>
	);
}

export default PlayerInventory;
