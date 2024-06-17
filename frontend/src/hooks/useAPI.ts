import axios from "axios";

const BASE_API_URL = "http://localhost:3000";

function useAPI() {
	async function get<T>(url: string): Promise<T | null> {
		try {
			const data: T = (
				await axios.get<T>(BASE_API_URL + url)
			).data;
			return data;
		} catch (error) {
			console.debug(error);
			return null;
		}
	}

	return { get };
}

export default useAPI;
