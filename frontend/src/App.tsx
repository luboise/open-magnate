import "./App.css";

import { RecoilRoot } from "recoil";

import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";
import PageAllMapPieces from "./pages/PageAllMapPieces";
import PageHomepage from "./pages/PageHomepage";
import PagePlayGame from "./pages/PagePlayGame";

function App() {
	return (
		<RecoilRoot>
			<h1>Open Magnate</h1>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<PageHomepage />}
					/>
					<Route
						path="/alltiles"
						element={<PageAllMapPieces />}
					/>
					<Route
						path="/play"
						element={<PagePlayGame />}
					/>
				</Routes>
			</BrowserRouter>
		</RecoilRoot>
	);
}

export default App;
