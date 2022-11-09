import { Middleware } from "koa";

export const errorHandler: Middleware = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = 200;
		ctx.body = {
			success: false,
			error: err.message,
		};
	}
};
