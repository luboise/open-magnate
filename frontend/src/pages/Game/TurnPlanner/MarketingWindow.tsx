import { useMemo } from "react";
import {
	MarketingTile,
	MarketingTilesByNumber
} from "../../../../../shared/Marketing";
import { useGameStateView } from "../../../hooks/game/useGameState";
import MapMarketingTile from "../Map/MapMarketingTile";
import "./MarketingWindow.css";

interface Props {
	employeeHiringIndex: number;
}

function MarketingWindow({ employeeHiringIndex }: Props) {
	const { myEmployees } = useGameStateView();

	const employee = useMemo(() => {
		const e = myEmployees[employeeHiringIndex];
		if (!e)
			throw new Error(
				`Invalid employee index: ${employeeHiringIndex}`
			);

		return e;
	}, [employeeHiringIndex, myEmployees]);

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
	tiles: MarketingTile[];
}

function MarketingColumn({ title, tiles }: ColumnProps) {
	return (
		<div>
			<h3>{title}</h3>
			<div className="marketing-column">
				{tiles.map((tile) => (
					<MapMarketingTile
						onClick={alert}
						tile={tile}
					/>
				))}
			</div>
		</div>
	);
}

export default MarketingWindow;

