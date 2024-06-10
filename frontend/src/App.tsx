import "./App.css";

import { RecoilRoot } from "recoil";

import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";
import PageAllMapPieces from "./pages/PageAllMapPieces";

function App() {
	return (
		<RecoilRoot>
			<h1>Open Magnate</h1>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<p>homepage</p>}
					/>
					<Route
						path="/alltiles"
						element={<PageAllMapPieces />}
					/>
				</Routes>
			</BrowserRouter>
		</RecoilRoot>
	);
}

export default App;
