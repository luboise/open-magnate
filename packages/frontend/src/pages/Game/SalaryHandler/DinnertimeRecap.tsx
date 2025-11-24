import { useMemo, useState } from "react";
import Button from "../../../global_components/Button";
import { GameEventView } from "../../../utils";
import "./DinnertimeRecap.css";
import SellEvent from "./SellEvent";

interface Props {
	event: GameEventView;
}

function DinnertimeRecap({ event }: Props) {
	const [sellIndex, setSellIndex] = useState<number>(0);
	const numItems = useMemo(
		() => event.data.length,
		[event.data]
	);

	const currentEvent = useMemo(
		() => event.data[sellIndex],
		[sellIndex]
	);

	return (
		<div id="dinnertime-recap">
			<div id="dinnertime-recap-content">
				<SellEvent event={currentEvent} />
				<span>
					{sellIndex + 1}/{event.data.length}
				</span>
			</div>
			<div id="dinnertime-recap-buttons">
				<Button
					onClick={() =>
						setSellIndex(
							(prev) => (prev - 1) % numItems
						)
					}
					inactive={sellIndex === 0}
				>
					{"<"}
				</Button>

				<Button
					onClick={() =>
						setSellIndex(
							(prev) => (prev + 1) % numItems
						)
					}
					inactive={sellIndex === numItems - 1}
				>
					{">"}
				</Button>
			</div>
		</div>
	);
}
export default DinnertimeRecap;
