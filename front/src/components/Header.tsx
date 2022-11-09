import React from "react";
import { UserProvider } from "../App";
import Login from "./Login";
import ModalConstructor, { Modal } from "./ModalConstructor";

function Header() {
	const [user, setUser] = React.useContext(UserProvider);
	const LoginModal = ModalConstructor();

	return (
		<header>
			<div className="space_between container">
				<h1>Skludge</h1>
				{user == null ? (
					<div>
						<LoginModal.Modal>
							<h1>Login</h1>
							<Login />
						</LoginModal.Modal>
						<nav>
							<button
								onClick={() => {
									LoginModal.setIsOpen(true);
								}}
							>
								Login
							</button>
						</nav>
					</div>
				) : (
					<p>{user.username}</p>
				)}
			</div>
		</header>
	);
}

export default Header;
