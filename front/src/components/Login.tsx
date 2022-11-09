import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserProvider } from "../App";

function Login() {
	const { register, handleSubmit } = useForm();
	const [user, setUser] = useContext(UserProvider);

	return (
		<form
			className="login_form"
			onSubmit={handleSubmit((data) => {
				console.log(data);
				axios.post("/user/login", data).then((res) => {
					setUser(res.data);
					console.log(res.data);
				});
			})}
		>
			<label>Username</label>
			<input {...register("username", { required: true })} placeholder="Enter username" />

			<label>Password</label>
			<input {...register("password", { required: true })} type="password" placeholder="Enter password" />

			<button className="cool_button" type="submit">
				Login
			</button>
		</form>
	);
}

export default Login;
