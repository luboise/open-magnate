import { MovePlaceRestaurant } from "magnate-core/Moves";
import { MoveTransactionFunction } from "./types";

export const AddNewRestaurant: MoveTransactionFunction =
	async (bundle, details: MovePlaceRestaurant) => {
		{
			// TODO: Add validation
			const updated =
				await bundle.ctx.gamePlayerRestaurant.create(
					{
						data: {
							gameId: bundle.gameId,
							playerNumber: bundle.player,

							x: details.x,
							y: details.y,
							entrance: details.entrance
						}
					}
				);

			return Boolean(updated);
		}
	};
