import { Middleware } from "koa";

export const errorHandler: Middleware = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		if (ctx.status === 200) ctx.status = 400;
		ctx.body = {
			success: false,
			error: err.message,
		};
	}
};
