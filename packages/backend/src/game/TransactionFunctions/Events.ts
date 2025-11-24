import { MoveTransactionFunctionUntyped } from "./types";

export const NewEvent: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx, gameId, transactionInfo } = bundle;
		console.log("NEW EVENT: ", transactionInfo);
		if (
			!transactionInfo ||
			transactionInfo.length === 0
		)
			return;

		await ctx.gameState.update({
			where: {
				id: gameId
			},
			data: {
				events: {
					create: {
						eventData: [
							...transactionInfo.map((item) =>
								JSON.stringify(item)
							)
						]
					}
				}
			}
		});
	};
