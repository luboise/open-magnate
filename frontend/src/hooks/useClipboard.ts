function useClipboard() {
	async function writeClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
	async function readClipboard(): Promise<string | null> {
		try {
			const text =
				await navigator.clipboard.readText();
			return text;
		} catch (error) {
			console.debug(error);
		}

		return null;
	}

	return {
		readClipboard,
		writeClipboard
	};
}

export default useClipboard;
