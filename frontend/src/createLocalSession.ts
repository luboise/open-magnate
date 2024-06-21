import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import LocalSessionData from "../../shared/LocalSessionData";
import useAPI from "./hooks/useAPI";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { APIRoutes } from "./utils";

export type LocalSessionDataType = LocalSessionData | null;
export type LocalSessionUpdater = (
	newLocalSession: LocalSessionDataType
) => Promise<boolean>;

const LOCAL_SESSION_NAME = "localSession";

export const createLocalSession = (): {
	localSession: LocalSessionDataType;
	updateLocalSession: LocalSessionUpdater;
	// refreshToken: () => Promise<boolean>;
} => {
	const { get, set } = useLocalStorage();
	const { get: getFromAPI } = useAPI();

	const initialSession: LocalSessionDataType =
		useMemo(() => {
			let localSession = get(
				LOCAL_SESSION_NAME
			) as LocalSessionData;

			if (!localSession || !localSession.authKey) {
				set(LOCAL_SESSION_NAME, null);
				return null;
			}

			return localSession;
		}, []);

	if (initialSession)
		axios.defaults.headers.common["Authorization"] =
			initialSession.authKey;

	// Local Session
	const [ls, setLs] =
		useState<LocalSessionDataType>(initialSession);

	async function update(
		newLs: LocalSessionDataType
	): Promise<boolean> {
		set(LOCAL_SESSION_NAME, newLs);
		setLs(newLs);

		console.debug(
			"TEST",
			axios.defaults.headers.common["Authorization"]
		);

		return true;
	}

	// async function refreshToken(): Promise<boolean> {
	//     const { data } = await useFetch<LocalSessionData>({
	//         url: APIRoutes.VALID_TOKEN,
	//         validator: () => Boolean(ls?.userId),
	//     });

	//     if (data) {
	//         await update(data);
	//         return true;
	//     }

	//     return false;
	// }

	useEffect(() => {
		async function updateThingo() {
			if (!ls || !ls.authKey) return;
			try {
				await getFromAPI(APIRoutes.VALID_TOKEN);
				console.debug("Auth token OK.");
			} catch (error) {
				console.debug("Auth token out of date.");
				update(null);
				return;
			}
		}

		updateThingo();
	}, []);

	useEffect(() => {
		if (ls)
			axios.defaults.headers.common["Authorization"] =
				ls.authKey;
		else
			delete axios.defaults.headers.common[
				"Authorization"
			];
	}, [ls]);

	return {
		localSession: ls,
		updateLocalSession: update
	};
};
