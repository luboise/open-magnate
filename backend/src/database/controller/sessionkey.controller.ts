import { SessionKey } from "../entity/SessionKey";
import SessionKeyRepository from "../repository/sessionkey.repository";

const SessionKeyController = {
	GetBySessionKey: async (sessionKey: string) => {
		return await SessionKeyRepository.getFirst({
			sessionKey: sessionKey
		});
	},
	FindByBrowserId: async (
		browserId: string | null
	): Promise<SessionKey | null> => {
		if (browserId === null) return null;
		return await SessionKeyRepository.getFirst({
			browserId: browserId
		});
	},
	New: async (
		browserId: string | null
	): Promise<SessionKey | null> => {
		if (browserId === null) return null;

		const newKey = await SessionKeyRepository.create({
			browserId: browserId
		});

		return newKey;
	},
	Renew: async (
		sessionKey: string,
		browserId: string
	): Promise<boolean> => {
		const key = await SessionKeyRepository.getFirst({
			sessionKey: sessionKey
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
	}
};

export default SessionKeyController;
