/*
;

export const GetPublicGameStateView = (
	gsv: GameStateView,
	playerNumber: number
): GameStateViewPerPlayer => {
	const player = gsv.players.find(
		(player) => player.playerNumber === playerNumber
	);
	if (!player)
		throw new Error(
			`Unable to get public game state for invalid player: ${playerNumber}`
		);

	const newVal: GameStateViewPerPlayer = {
		...gsv,
		players: gsv.players.map((eachPlayer) => {
			const { employees, ...rest } = eachPlayer;
			return {
				...rest
			};
		}),
		privateData: player
	};

	return newVal;
};

export function CreateGameEventView(
	event: GameEvent
): GameEventView {
	const arr = parseJsonArray(event.eventData).map((val) =>
		JSON.parse(val)
	) as TransactionInfo[];

	const data: GameEventView = {
		time: event.time,
		data: arr
	};

	return data;
}

export function CreateMarketingCampaignView(
	campaign: MarketingCampaign
): MarketingCampaignView {
	return {
		playerNumber: campaign.playerNumber,
		priority: campaign.priority,
		turnsRemaining: campaign.turnsRemaining,

		type: campaign.type,
		pos: {
			x: campaign.x,
			y: campaign.y,
			orientation: campaign.orientation
		},
		foodType: campaign.demand
	};
}

export function MakeLobbyView(lobby: FullLobby) {
	const lobbyData: LobbyView = {
		inGame:
			lobby.gameState !== null &&
			lobby.gameState.turnProgress !==
				TURN_PROGRESS.PREGAME &&
			lobby.gameState.turnProgress !==
				TURN_PROGRESS.POSTGAME,

		lobbyId: lobby.id,
		lobbyName: lobby.name,

		inviteCode: lobby.inviteCode,
		players: lobby.playersInLobby.map((player) => ({
			name: player.userSession.name,
			playerNumber: player.playerNumber,
			isHost: player.isHost,
			restaurant:
				lobby.gameState?.players.find(
					(innerPlayer) =>
						innerPlayer.number ===
						player.playerNumber
				)?.restaurantData.id ?? 1
		}))
	};

	return lobbyData;
}

export function MakeLobbyViewForPlayer(
	lobby: FullLobby,
	sessionKey: string
): PlayerLobbyView | null {
	try {
		const lobbyView = MakeLobbyView(lobby);

		const player = lobby.playersInLobby.find(
			(player) =>
				player.userSession.sessionKey === sessionKey
		);

		if (!player)
			throw new Error(
				"Unable to find player in lobby."
			);

		return {
			...lobbyView,
			hosting: player.isHost,
			playerNumber: player.playerNumber
		};
	} catch (error) {
		console.error(error);
	}
	return null;
}

*/
