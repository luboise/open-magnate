import "./Animations.css";
import "./App.css";

import "./global_styles/corner-button.css";
import "./global_styles/highlighted.css";

import {
	BrowserRouter,
	Link,
	Route,
	Routes
} from "react-router-dom";
// import PageAllMapPieces from "./pages/PageAllMapPieces";
import { RecoilRoot } from "recoil";
import PageHomepage from "./pages/HomePage/PageHomepage";
import PageLobby from "./pages/Lobby/PageLobby";
import { FrontendRoutes } from "./utils";

function App() {
	// const { localSession } = createLocalSession();

	// if (!localSession) {
	// 	return (
	// 		<RecoilRoot>
	// 			<AuthForm />
	// 		</RecoilRoot>
	// 	);
	// }

	return (
		<>
			<h1>Open Magnate</h1>
			<BrowserRouter>
				<Routes>
					<Route
						path={FrontendRoutes.HOME}
						element={<PageHomepage />}
					/>
					{/* <Route
						path="/alltiles"
						element={<PageAllMapPieces />}
						/> */}
					{/* <Route
						path={FrontendRoutes.PLAY}
						element={<PagePlay />}
						/> */}
					<Route
						path={FrontendRoutes.PLAY}
						element={
							<RecoilRoot>
								<PageLobby />
							</RecoilRoot>
						}
					/>
					<Route
						path="*"
						element={
							<>
								<p>
									This page could not be
									found. Click below to
									return to the homepage.
								</p>
								<Link
									to={FrontendRoutes.HOME}
								>
									<button>Return</button>
								</Link>
							</>
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
