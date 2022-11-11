import { useNavigate } from "react-router-dom";

export const navigate = (path: string) => {
	const nav = useNavigate();
	return () => nav(path);
};

export const goto = (path: string) => {
	const nav = useNavigate();
	nav(path);
};
