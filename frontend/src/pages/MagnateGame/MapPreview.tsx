import { parseMapChar } from "../../../../backend/src/game/Map";
import MapTile from "../../components/MapTile";
import "./MapPreview.css";

function MapPreview(props: { map: string }) {
	return (
		<div className="map-preview-container">
			{...props.map.split(";").map((line, x) => (
				<div className="map-tile-row">
					{line.split("").map((char, y) => (
						<MapTile
							tile={parseMapChar(char, x, y)}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export default MapPreview;
