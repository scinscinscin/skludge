import React from "react";
import { Routes, Route } from "react-router-dom";
import TaskCreate from "../pages/TaskCreate";
import TaskPage from "../pages/TaskPage";

const TaskRouter = (
	<Routes>
		<Route path="create" element={<TaskCreate />} />
		<Route path="/:uuid" element={<TaskPage />} />
	</Routes>
);

export default TaskRouter;
