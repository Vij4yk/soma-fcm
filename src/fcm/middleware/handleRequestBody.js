import parse from 'co-body'

export default () => async (ctx, next) => {
  try {
    ctx.requestbody = await parse.json(ctx)
    if (ctx.requestBody.constructor !== Array) {
      ctx.requestBody = [].concat.apply([], ctx.requestBody)
    }
    await next()
  } catch (err) {
    ctx.status = 500
    throw err
  }
}
