import { UserSession } from "@prisma/client";
import prisma from "../../datasource";
import UserSessionRepository from "../repository/usersession.repository";

const UserSessionController = {
	GetBySessionKey: async (sessionKey: string) => {
		const sk = await UserSessionRepository.findFirst({
			where: { sessionKey: sessionKey }
		});

		return sk;
	},
	FindByBrowserId: async (
		browserId: string | null
	): Promise<UserSession | null> => {
		if (browserId === null) return null;
		return await UserSessionRepository.findFirst({
			where: { browserId: browserId }
		});
	},
	New: async (
		browserId: string | null
	): Promise<UserSession | null> => {
		if (browserId === null) return null;

		const newKey = await UserSessionRepository.create({
			data: {
				browserId: browserId
			}
		});

		return newKey;
	},
	Renew: async (
		sessionKey: string,
		browserId: string
	): Promise<boolean> => {
		const userSession =
			await UserSessionRepository.findFirst({
				where: { sessionKey: sessionKey }
			});

		// If the user submitted a bad key
		if (!userSession) {
			return false;
		}
		// If the user submitted a good key from the same browser
		else if (browserId === userSession.browserId) {
			return true;
		}

		// If the user is from a new browser/session, update their session data
		if (browserId !== userSession.browserId) {
			userSession.browserId = browserId;

			const updatedUserSession =
				await prisma.userSession.update({
					where: { sessionKey: sessionKey },
					data: {
						browserId: browserId
					}
				});

			if (!updatedUserSession) {
				return false;
			}
			return true;
		}

		return false;
	},

	async GetDeep(sessionKey: string) {
		const user = prisma.userSession.findFirst({
			where: { sessionKey: sessionKey },
			include: {
				lobbyPlayer: {
					include: { lobby: true }
				}
			}
		});
		// console.log("GetDeep result: ", user);

		return user ?? null;
	}
};

export default UserSessionController;
