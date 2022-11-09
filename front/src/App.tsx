import axios from "axios";
import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

interface User {
	username: string;
	uuid: string;
}

type UseStateReturn<S> = [S, React.Dispatch<React.SetStateAction<S>>];
export const UserProvider = React.createContext<UseStateReturn<User | null>>(undefined as any);

function App() {
	const [user, setUser] = React.useState<User | null>(null);

	// Check if the user is logged in
	React.useEffect(() => {
		axios
			.get("/user/get")
			.then((res) => {
				setUser(res.data);
			})
			.catch(() => {
				setUser(null);
			});
	}, []);

	return (
		<UserProvider.Provider value={[user, setUser]}>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</UserProvider.Provider>
	);
}

function Home() {
	return (
		<main className="container">
			<h1>...is a new org management system</h1>
			<h1 style={{ textAlign: "center", marginTop: "50px" }}>Coming soon</h1>
		</main>
	);
}
export default App;
