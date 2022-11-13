import { Middleware } from "koa";

export const errorHandler: Middleware = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.error(err);

		if (ctx.status === 200 || ctx.body == null) ctx.status = 400;
		ctx.body = {
			success: false,
			error: err.message,
		};
	}
};
