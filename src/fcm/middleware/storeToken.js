import parse from 'co-body'

export default () => async (ctx, next) => {
  const db = ctx['soma_development']

  try {

    const requestBody = [await parse.json(ctx)]
    await Promise.all(requestBody.map(async({ device_id, token }) => {

      const c = await db.query('SELECT * FROM client WHERE device_id = $1 LIMIT 1', [device_id])

      let clientId
      if (c.rowCount == 1) {
        clientId = c.rows[0].id
      } else {
        clientId = await db.query('INSERT INTO client (device_id) VALUES ($1) RETURNING id', [device_id])
      }

      await db.query(`INSERT INTO fcm (client_id, token) VALUES ($1, $2)
                     ON CONFLICT (client_id, token) DO UPDATE
                     SET token = $2`, [clientId, token])

      console.log(clientId, device_id, token)

    }))

    await next()

  } catch (err) {
    if (err.code === '23505') {
      console.log(err.detail)
      await next()
    } else {
      ctx.status = 500
      throw err
    }
  }
}
