import { Middleware } from "koa";
import { RuntypeBase } from "runtypes/lib/runtype";

export function validateBody(validator: RuntypeBase): Middleware {
  return async (ctx, next) => {
    const body = validator.validate(ctx.request.body);
    if (body.success == true) {
      ctx.state.body = body.value;
      await next();
    } else {
      ctx.body = { success: false, error: body.message };
    }
  };
}
