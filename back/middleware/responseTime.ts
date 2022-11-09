import { Middleware } from "koa";

export const responseTime: Middleware = async (ctx, next) => {
	const starting = Date.now();
	await next();
	ctx.set("X-Response-Time", `${Date.now() - starting}`);
};
