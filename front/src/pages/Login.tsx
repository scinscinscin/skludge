import axios from "axios";
import React from "react";
import { FieldValue, useForm } from "react-hook-form";
import { UserProvider } from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
	const [_, setUser] = React.useContext(UserProvider);
	const navigate = useNavigate();

	const LoginForm = useForm();
	function SubmitLogin(data: FieldValue<{ username: string; password: string }>) {
		console.log(data);
		axios
			.post("/user/login", data)
			.then(({ data }) => {
				setUser(data);
				navigate("/");
			})
			.catch();
	}

	return (
		<>
			<h1>Login</h1>
			<form onSubmit={LoginForm.handleSubmit(SubmitLogin)}>
				<label>Username</label>
				<input {...LoginForm.register("username", { required: true })}></input>

				<label>Password</label>
				<input {...LoginForm.register("password", { required: true })}></input>
				<button type="submit">Login</button>
			</form>
		</>
	);
}

export default Login;
