export function useLocalStorage(): {
	get: (toRead: string) => object | string;
	set: (
		toWrite: string,
		data: Object | null | undefined
	) => void;
	deleteFromLS: (toDelete: string) => void;
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

	const deleteFunction = (toDelete: string) => {
		// Check if toDelete exists in localStorage
		if (!localStorage.getItem(toDelete)) {
			return;
		}

		localStorage.removeItem(toDelete);
		console.debug(
			`Removed ${toDelete} from localStorage.`
		);
	};

	return {
		get: readFunction,
		set: writeFunction,
		deleteFromLS: deleteFunction
	};
}
