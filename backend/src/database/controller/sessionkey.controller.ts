import { Lobby } from "../entity/Lobby";
import { LobbyPlayer } from "../entity/LobbyPlayer";
import { SessionKey } from "../entity/SessionKey";
import SessionKeyRepository from "../repository/sessionkey.repository";

const SessionKeyController = {
	GetBySessionKey: async (sessionKey: string) => {
		const sk = SessionKeyRepository.findOne({
			relations: ["lobbyPlayer", "lobbyPlayer.lobby"],
			where: { sessionKey: sessionKey }
		});

		return sk;
	},
	FindByBrowserId: async (
		browserId: string | null
	): Promise<SessionKey | null> => {
		if (browserId === null) return null;
		return await SessionKeyRepository.findOne({
			where: { browserId: browserId }
		});
	},
	New: async (
		browserId: string | null
	): Promise<SessionKey | null> => {
		if (browserId === null) return null;

		const newKey = new SessionKey();
		newKey.browserId = browserId;

		const sk = await SessionKeyRepository.save(newKey);

		return sk;
	},
	Renew: async (
		sessionKey: string,
		browserId: string
	): Promise<boolean> => {
		const key = await SessionKeyRepository.findOne({
			where: { sessionKey: sessionKey }
		});

		// If the user submitted a bad key
		if (!key) {
			return false;
		}
		// If the user submitted a good key from the same browser
		else if (browserId === key.browserId) {
			return true;
		}

		// If the user is from a new browser/session, update their session data
		if (browserId !== key.browserId) {
			key.browserId = browserId;

			const updatedKey = await key.save();
			if (!updatedKey) {
				return false;
			}
			return true;
		}

		return false;
	},

	GetDeep(sessionKey: string) {
		SessionKeyRepository.createQueryBuilder("sk")
			.leftJoinAndSelect(
				LobbyPlayer,
				"lp",
				"lp.sessionKey = sk"
			)
			.leftJoinAndSelect(
				Lobby,
				"l",
				"l.lobbyId = lp.lobbyId"
			)
			.where("sk.sessionKey = :key", {
				key: sessionKey
			})
			.getMany();
	}
};

export default SessionKeyController;
