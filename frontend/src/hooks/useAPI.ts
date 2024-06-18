import axios from "axios";

const LIVE_REQUEST_URL = "http://localhost:3000";

async function makeRequest<ResT, ReqT>(
	reqType: string,
	url: string,
	data?: ReqT
): Promise<ResT | null> {
	try {
		const res = await axios<ResT>({
			method: reqType,
			url: LIVE_REQUEST_URL + url,
			data: data,
			withCredentials: false
		});

		return res.data as ResT;
	} catch (error: any) {
		const text =
			error.response?.data ||
			error.message ||
			"Unknown error";

		console.debug(
			`Axios request had an error: ${text}`
		);
		throw new Error(text);
	}
}

function useAPI() {
	async function get<T>(url: string): Promise<T | null> {
		try {
			const data: T = (
				await axios.get<T>(LIVE_REQUEST_URL + url)
			).data;
			return data;
		} catch (error) {
			console.debug(error);
			return null;
		}
	}

	async function post<ResT, ReqT>(
		url: string,
		data: ReqT
	): Promise<ResT | null> {
		try {
			return makeRequest("POST", url, data);
		} catch (error) {
			console.debug(error);
			return null;
		}
	}

	return { get, post };
}

export default useAPI;
