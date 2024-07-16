type FormProps<T> = {
	onSubmit: (data: T) => void;
	submitText?: string;
};

function Form<T>(
	props: React.PropsWithChildren<FormProps<T>>
) {
	function onFormSubmit(
		event: React.FormEvent<HTMLFormElement>
	): void {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		props.onSubmit(Object.fromEntries(data) as T);
	}

	return (
		<form onSubmit={onFormSubmit}>
			{props.children}
			<input
				type="submit"
				value={props.submitText || "Submit"}
				readOnly={true}
			/>
		</form>
	);
}

export default Form;
