export default () => async (ctx) => {
  const db = ctx['soma_development']

  try {
    const result = await db.query('SELECT token FROM fcm')
    ctx.body = JSON.stringify(result.rows)
  } catch (err) {
    ctx.status = 500
    throw err
  }
}
