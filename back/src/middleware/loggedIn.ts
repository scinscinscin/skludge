import { Middleware } from "@koa/router";
import jwt from "jsonwebtoken";
import { UserRepository } from "../routers/UserRouter";

// Checks if the user is logged in and stores their user profile in
export function loggedIn(): Middleware {
	return async (ctx, next) => {
		const jwt_token = ctx.cookies.get("jwt");

		try {
			const payload = jwt.verify(jwt_token, process.env.JWT_SECRET);
			if (typeof payload != "object") throw "";
			const user = await UserRepository.findOneBy({ uuid: payload.uuid });
			if (user == null) throw "";
			ctx.state.user = user;
		} catch {
			ctx.status = 401;
			ctx.cookies.set("jwt", null, { maxAge: 0 });
			throw new Error("You are not authorized to access this endpoint");
		}

		await next();
	};
}
