export function useLocalStorage(): {
	get: (toRead: string) => any;
	set: (
		toWrite: string,
		data: Object | null | undefined
	) => void;
} {
	const readFunction = (toRead: string): any => {
		try {
			const fetchedData =
				localStorage.getItem(toRead);
			if (!fetchedData) return null;

			const parsedData = JSON.parse(fetchedData);
			return parsedData;
		} catch (error) {
			localStorage.removeItem(toRead);
		}
		return null;
	};

	const writeFunction = (
		toWrite: string,
		data: Object | null | undefined
	): void => {
		// Check for empty write
		// if (data === null) {
		//     console.debug(`Removing ${toWrite} from localStorage.`);
		//     localStorage.removeItem(toWrite);
		//     return;
		// }
		localStorage.setItem(toWrite, JSON.stringify(data));
		console.debug(
			`Updated ${toWrite} in localStorage to `,
			data
		);
	};

	return { get: readFunction, set: writeFunction };
}
