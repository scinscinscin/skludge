import { useForm } from "react-hook-form";

function Login() {
	const { register, handleSubmit } = useForm();

	return (
		<form
			className="login_form"
			onSubmit={handleSubmit((data) => {
				console.log(data);
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
