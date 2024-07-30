import { useGameState } from "../../../hooks/game/useGameState";
import "./TurnProgressIndicator.css";

function TurnProgressIndicator() {
	const { turnProgress } = useGameState();

	const topRow = [
		"Restructure",
		"Turn Order",
		"Working",
		"Dinnertime",
		"Payday",
		"Cleanup"
	];

	return (
		<div className="magnate-tp-container">
			<div className="magnate-tp-group">
				{...topRow.map((item) => (
					<div className="magnate-tp-item">
						<span
							style={{
								opacity:
									item === turnProgress
										? 1
										: 0.3
							}}
						>
							{item}
						</span>
					</div>
				))}
			</div>
			<div className="magnate-tp-group"></div>
		</div>
	);
}

export default TurnProgressIndicator;
