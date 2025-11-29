import { useDerivedGameState } from "../../../../hooks/game/useDerivedGameState";
import RestaurantImage from "../../../../global_components/RestaurantImage";
import { RestaurantTile } from "magnate-core/game";
import { useEffect } from "react";


interface Props {
	tile: RestaurantTile
}

function MapRestaurantTile({ tile }: Props) {
	const { players } = useDerivedGameState();


	useEffect(() => {
		console.log(tile)
	}, []);

	return (<div
		className={"map-tile map-tile-restaurant"}
		style={{
			gridColumn: `${tile.position.x + 1} / span ${tile.width}`,
			gridRow: `${tile.position.y + 1} / span ${tile.height}`
		}}
	>
		<RestaurantImage
			restaurantIndex={players[tile.ownerIndex].restaurantIndex ?? 1}
			style={{
				// gridColumn: `${tile.position.x + 1} / span 2`,
				// gridRow: `${tile.position.y + 1} / span 2`,
				// Red if invalid placement

				// backgroundBlendMode: "multiply",

				width: "100%",
				height: "100%",
				// Span 2 rows and 2 columns

				// mixBlendMode: "multiply",

				border: "1px solid black",
				zIndex: 2
			}}
		/>
	</div>);

}

export default MapRestaurantTile
