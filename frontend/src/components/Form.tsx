import useAPI from "../hooks/useAPI";
import { APIRoutes } from "../utils";

function Form(props: React.PropsWithChildren) {
	const { post } = useAPI();

	async function onFormSubmit(
		event: React.FormEvent<HTMLFormElement>
	): void {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const result = await post(APIRoutes.);
	}

	return (
		<form onSubmit={onFormSubmit}>
			{props.children}
		</form>
	);
}

export default Form;
