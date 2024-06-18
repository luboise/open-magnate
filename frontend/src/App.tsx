import "./App.css";

import { RecoilRoot } from "recoil";

import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";
// import PageAllMapPieces from "./pages/PageAllMapPieces";
import { createLocalSession } from "./createLocalSession";
import AuthForm from "./pages/AuthForm";
import PageGame from "./pages/PageGame";
import PageHomepage from "./pages/PageHomepage";
import PagePlay from "./pages/PagePlay";

function App() {
	const { localSession } = createLocalSession();

	if (!localSession) {
		return (
			<RecoilRoot>
				<AuthForm />
			</RecoilRoot>
		);
	}

	return (
		<RecoilRoot>
			<h1>Open Magnate</h1>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<PageHomepage />}
					/>
					{/* <Route
						path="/alltiles"
						element={<PageAllMapPieces />}
					/> */}
					<Route
						path="/play"
						element={<PagePlay />}
					/>
					<Route
						path="/game"
						element={<PageGame gameId={null} />}
					/>
				</Routes>
			</BrowserRouter>
		</RecoilRoot>
	);
}

export default App;
