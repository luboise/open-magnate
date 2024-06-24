import { Lobby } from "../entity/Lobby";
import { LobbyPlayer } from "../entity/LobbyPlayer";
import { UserSession } from "../entity/UserSession";
import UserSessionRepository from "../repository/usersession.repository";

const UserSessionController = {
	GetBySessionKey: async (sessionKey: string) => {
		const sk = UserSessionRepository.findOne({
			relations: ["lobbyPlayer", "lobbyPlayer.lobby"],
			where: { sessionKey: sessionKey }
		});

		return sk;
	},
	FindByBrowserId: async (
		browserId: string | null
	): Promise<UserSession | null> => {
		if (browserId === null) return null;
		return await UserSessionRepository.findOne({
			where: { browserId: browserId }
		});
	},
	New: async (
		browserId: string | null
	): Promise<UserSession | null> => {
		if (browserId === null) return null;

		const newKey = UserSessionRepository.create({
			browserId: browserId
		});

		const sk = await UserSessionRepository.save(newKey);

		return sk;
	},
	Renew: async (
		sessionKey: string,
		browserId: string
	): Promise<boolean> => {
		const key = await UserSessionRepository.findOne({
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

	async GetDeep(sessionKey: string) {
		// return await UserSessionRepository.preload({
		// 	sessionKey: sessionKey
		// });

		if (
			!(await UserSessionRepository.exists({
				where: { sessionKey: sessionKey }
			}))
		) {
			console.log(
				`No user exists with sessionKey "${sessionKey}"`
			);
			return null;
		}

		// const user = await UserSessionRepository.findOne({
		// 	relations: ["lobbyPlayer"],
		// 	where: { sessionKey: sessionKey }
		// });

		// const lp = await LobbyPlayer.findOne({
		// 	relations: ["userSession.lobbyPlayer", "lobby"],
		// 	where: {
		// 		userSession: { sessionKey },
		// 		sessionKey: sessionKey
		// 	}
		// });

		// const user = lp?.userSession ?? null;

		const user =
			await UserSessionRepository.createQueryBuilder(
				"us"
			)
				.leftJoinAndMapOne(
					"us.lobbyPlayer",
					LobbyPlayer,
					"lp"
				)
				.leftJoinAndMapOne("lp.lobby", Lobby, "l")
				.where("us.sessionKey = :key", {
					key: sessionKey
				})
				.getOne();

		console.log(user);

		return user ?? null;
	}
};

export default UserSessionController;
