import { Middleware } from "@koa/router";
import { PERMISSION, User } from "../entity/User";

export function validatePermissions(perm: PERMISSION): Middleware {
	return async function (ctx, next) {
		const user = ctx.state.user as User | null;

		if (user == null)
			throw new Error("Was not able to find user in ctx.state, ensure that you're calling the loggedIn middleware");

		if (user.permissionLevel < perm) throw new Error("Invalid permissions for this route");

		await next();
	};
}
