import { useMemo } from "react";
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
				tiles={[11, 12, 13, 14, 15, 16]}
			/>
			<MarketingColumn
				title="Mailboxes"
				tiles={[7, 8, 9, 10]}
			/>
			<MarketingColumn
				title="Planes"
				tiles={[4, 5, 6]}
			/>
			<MarketingColumn
				title="Radio"
				tiles={[1, 2, 3]}
			/>
		</div>
	);
}

interface ColumnProps {
	title: string;
	tiles: number[];
}

function MarketingColumn({ title, tiles }: ColumnProps) {
	return (
		<div>
			<h3>{title}</h3>
			{tiles.map((tileNumber) => (
				<MapMarketingTile tileNumber={tileNumber} />
			))}
		</div>
	);
}

export default MarketingWindow;

