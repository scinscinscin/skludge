import Login from "./components/Login";
import ModalConstructor from "./components/ModalConstructor";

function App() {
	const LoginModal = ModalConstructor();

	return (
		<div>
			<LoginModal.Modal>
				<h1>Login</h1>
				<Login />
			</LoginModal.Modal>

			<header>
				<div className="space_between container">
					<h1>Skludge</h1>
					<nav>
						<ul>
							<li>
								{" "}
								<button
									onClick={() => {
										LoginModal.setIsOpen(true);
										console.log("I am falling, I am faded, I am drowning, help me to breathe.");
									}}
								>
									Login
								</button>{" "}
							</li>
						</ul>
					</nav>
				</div>
			</header>

			<main className="container">
				<h1>...is a new org management system</h1>
				<h1 style={{ textAlign: "center", marginTop: "50px" }}>Coming soon</h1>
			</main>
		</div>
	);
}

export default App;
