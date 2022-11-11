import React from "react";
import { Link } from "react-router-dom";
import { UserProvider } from "../App";
import { navigate } from "../utils/navigate";

function Header() {
	const [user] = React.useContext(UserProvider);

	return (
		<header className="header">
			<div className="space_between container">
				<Link to="/">
					<h1>Skludge</h1>
				</Link>

				<nav>{user == null ? <BasicNav /> : <AuthNav />}</nav>
			</div>
		</header>
	);
}

function BasicNav() {
	return (
		<button className="link_button" onClick={navigate("/login")}>
			Login
		</button>
	);
}

function AuthNav() {
	const [user, setUser] = React.useContext(UserProvider);
	return (
		<>
			<p>{user!.username}</p>
		</>
	);
}
export default Header;
