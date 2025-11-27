import "./Animations.css";
import "./App.css";

import "./global_styles/blurred.css";
import "./global_styles/centered.css";
import "./global_styles/corner-button.css";
import "./global_styles/highlighted.css";

import {
	BrowserRouter,
	Link,
	Route,
	Routes
} from "react-router-dom";
// import PageAllMapPieces from "./pages/PageAllMapPieces";
import { FrontendRoutes } from "magnate-core";
import { RecoilRoot } from "recoil";
import PageHomepage from "./pages/HomePage/PageHomepage";
import PageLobby from "./pages/Lobby/PageLobby";
import PageMapTest from "./pages/Test/PageMapTest";

// const flexFont = function () {
// 	var divs = document.getElementsByClassName(
// 		"flex-font"
// 	) as HTMLCollectionOf<HTMLDivElement>;
// 	for (var i = 0; i < divs.length; i++) {
// 		var relFontsize = divs[i].offsetWidth * 0.05;
// 		divs[i].style.fontSize = relFontsize + "px";
// 	}
// };

// window.onload = function (_event) {
// 	flexFont();
// };
// window.onresize = function (_event) {
// 	flexFont();
// };

function App() {
	return (
		<>
			<h1>Open Magnate</h1>
			<BrowserRouter>
				<Routes>
					<Route path={"/test/map"}
						element={<PageMapTest />}
					/>
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
