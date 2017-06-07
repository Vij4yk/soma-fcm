import parse from 'co-body'

export default () => async (ctx, next) => {
  try {
    ctx.requestBody = [].concat.apply([], await parse.json(ctx))
    console.log(JSON.stringify(ctx.requestBody[2]))
    await next()
  } catch (err) {
    ctx.status = 500
    throw err
  }
}

