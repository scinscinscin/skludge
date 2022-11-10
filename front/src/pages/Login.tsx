import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserProvider } from "../App";

function Login() {
	const LoginForm = useForm();
	const [user, setUser] = useContext(UserProvider);

	return (
		<form
			className="login_form"
			onSubmit={LoginForm.handleSubmit((data) => {
				console.log(data);
				axios.post("/user/login", data).then((res) => {
					setUser(res.data);
					console.log(res.data);
				});
			})}
		>
			<label>Username</label>
			<input {...LoginForm.register("username", { required: true })} />

			<label>Password</label>
			<input {...LoginForm.register("password", { required: true })} type="password" />

			<button className="cool_button" type="submit">
				Login
			</button>
		</form>
	);
}

export default Login;
