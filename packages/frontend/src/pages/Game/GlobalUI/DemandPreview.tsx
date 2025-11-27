import "./DemandPreview.css";

import { ImgHTMLAttributes } from "react";
import Image from "../../../global_components/Image";
import { DemandType } from "magnate-core/game";

interface Props
	extends ImgHTMLAttributes<HTMLImageElement> {
	demand: DemandType;
}

function GameDemandTile({ demand, className, ...args }: Props) {
	return (
		<Image
			className={`demand-image ${className}`}
			url={`/resources/demand/${demand}.png`}
			{...args}
		/>
	);
}

export default GameDemandTile;
