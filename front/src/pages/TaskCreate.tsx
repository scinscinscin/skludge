import "./Tasks.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FieldValue, useForm } from "react-hook-form";
import axios from "axios";

function TaskCreate() {
	const navigate = useNavigate();

	const Form = useForm();
	function submit(formData: FieldValue<{ title: string; body: string }>) {
		console.log(formData);

		axios
			.post("/task/create", formData)
			.then(() => {
				navigate("/");
			})
			.catch();
	}

	return (
		<>
			<h1> Create New Task </h1>
			<form onSubmit={Form.handleSubmit(submit)}>
				<label>Title</label>
				<input {...Form.register("title", { required: true })} />

				<label>Body</label>
				<input {...Form.register("body", { required: true })} />

				<button type="submit">Submit</button>
			</form>
		</>
	);
}

export default TaskCreate;
