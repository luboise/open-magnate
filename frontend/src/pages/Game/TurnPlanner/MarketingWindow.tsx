import { useMemo } from "react";
import {
	MarketingTile,
	MarketingTilesByNumber,
	PartialMarketingTile
} from "../../../../../shared/MapTiles/MarketingTiles";
import useClientState from "../../../hooks/game/useClientState";
import { useGameStateView } from "../../../hooks/game/useGameState";
import MapMarketingTile from "../Map/MapMarketingTile";
import "./MarketingWindow.css";

interface Props {
	employeeHiringIndex: number;
}

function MarketingWindow({ employeeHiringIndex }: Props) {
	const { myEmployees, playerData, marketingCampaigns } =
		useGameStateView();

	const { startPlacing } = useClientState();

	const employee = useMemo(() => {
		const e = myEmployees[employeeHiringIndex];
		if (!e)
			throw new Error(
				`Invalid employee index: ${employeeHiringIndex}`
			);

		return e;
	}, [employeeHiringIndex, myEmployees]);

	function MarketingColumn({
		title,
		tiles
	}: ColumnProps) {
		return (
			<div>
				<h3>{title}</h3>
				<div className="marketing-column">
					{...tiles.map((partialTile) => {
						const inUse =
							marketingCampaigns.some(
								(campaign) =>
									campaign.priority ===
									partialTile.tileNumber
							);

						const tile: MarketingTile = {
							...partialTile,
							placingEmployee:
								playerData.playerNumber
						};

						return (
							<MapMarketingTile
								onClick={() =>
									!inUse &&
									startPlacing(tile)
								}
								style={{
									filter: inUse
										? "grayscale(100%)"
										: undefined
								}}
								tile={tile}
							/>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<div className="marketing-window">
			<MarketingColumn
				title="Billboards"
				tiles={[
					MarketingTilesByNumber[11],
					MarketingTilesByNumber[12],
					MarketingTilesByNumber[13],
					MarketingTilesByNumber[14],
					MarketingTilesByNumber[15],
					MarketingTilesByNumber[16]
				]}
			/>
			<MarketingColumn
				title="Mailboxes"
				tiles={[
					MarketingTilesByNumber[7],
					MarketingTilesByNumber[8],
					MarketingTilesByNumber[9],
					MarketingTilesByNumber[10]
				]}
			/>
			<MarketingColumn
				title="Planes"
				tiles={[
					MarketingTilesByNumber[4],
					MarketingTilesByNumber[5],
					MarketingTilesByNumber[6]
				]}
			/>
			<MarketingColumn
				title="Radio"
				tiles={[
					MarketingTilesByNumber[1],
					MarketingTilesByNumber[2],
					MarketingTilesByNumber[3]
				]}
			/>
		</div>
	);
}

interface ColumnProps {
	title: string;
	tiles: PartialMarketingTile[];
}

export default MarketingWindow;

